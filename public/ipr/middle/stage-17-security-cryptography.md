# Этап 17: Security & Cryptography - Детальные задания

## Задание 17.1: Advanced Authentication & Authorization

### 🎯 Цель

Создать enterprise-уровень систему безопасности с multi-factor authentication, role-based access control и защитой от современных типов атак

### 📋 Требования

#### Функциональные требования:

- [ ] Multi-factor authentication (TOTP, SMS, Email)
- [ ] Role-based access control (RBAC)
- [ ] Session management с secure cookies
- [ ] OAuth 2.0 / OpenID Connect интеграция
- [ ] Biometric authentication support

#### Технические требования:

- [ ] JWT с refresh token rotation
- [ ] Rate limiting и DDoS protection
- [ ] CSRF и XSS protection
- [ ] Input validation и sanitization
- [ ] Audit logging системы

### 🔐 Advanced Authentication Service

#### services/AuthenticationService.ts

```typescript
import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { sign, verify } from "jsonwebtoken";
import { authenticator } from "otplib";
import bcrypt from "bcryptjs";
import type {
  User,
  AuthToken,
  AuthProvider,
  MFASecret,
  SecurityEvent,
  SessionInfo,
} from "@clh/types";

export interface AuthenticationOptions {
  jwtSecret: string;
  refreshTokenSecret: string;
  tokenExpiry: string;
  refreshTokenExpiry: string;
  passwordMinLength: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
}

export class AuthenticationService {
  private options: AuthenticationOptions;
  private loginAttempts = new Map<
    string,
    { count: number; lastAttempt: Date }
  >();
  private activeSessions = new Map<string, SessionInfo>();

  constructor(options: AuthenticationOptions) {
    this.options = options;
  }

  // === CORE AUTHENTICATION ===

  // Register new user with secure password hashing
  async registerUser(userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }): Promise<{ user: User; tokens: AuthToken }> {
    try {
      // Validate password strength
      this.validatePasswordStrength(userData.password);

      // Check if user already exists
      const existingUser = await this.getUserByEmail(userData.email);
      if (existingUser) {
        throw new Error("User already exists");
      }

      // Hash password with salt
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(userData.password, saltRounds);

      // Generate unique user ID
      const userId = this.generateSecureId();

      // Create user
      const user: User = {
        id: userId,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        passwordHash,
        role: "user",
        mfaEnabled: false,
        emailVerified: false,
        phoneVerified: false,
        createdAt: new Date(),
        lastLogin: null,
        loginAttempts: 0,
        locked: false,
        twoFactorSecret: null,
      };

      // Save user to database
      await this.saveUser(user);

      // Generate tokens
      const tokens = await this.generateTokens(user);

      // Create session
      await this.createSession(user.id, tokens.accessToken);

      // Log security event
      await this.logSecurityEvent({
        type: "user_registered",
        userId: user.id,
        ip: this.getCurrentIP(),
        userAgent: this.getCurrentUserAgent(),
        timestamp: new Date(),
      });

      return { user: this.sanitizeUser(user), tokens };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  // Login with multiple authentication methods
  async loginUser(credentials: {
    email: string;
    password?: string;
    mfaCode?: string;
    biometricSignature?: string;
    rememberMe?: boolean;
  }): Promise<{ user: User; tokens: AuthToken; requiresMFA?: boolean }> {
    try {
      const { email, password, mfaCode, biometricSignature } = credentials;

      // Check rate limiting
      this.checkRateLimit(email);

      // Get user
      const user = await this.getUserByEmail(email);
      if (!user) {
        await this.recordFailedAttempt(email);
        throw new Error("Invalid credentials");
      }

      // Check if account is locked
      if (user.locked) {
        throw new Error("Account is locked. Please contact support.");
      }

      // Verify credentials
      let isValidCredentials = false;

      if (password) {
        isValidCredentials = await bcrypt.compare(password, user.passwordHash);
      } else if (biometricSignature) {
        isValidCredentials = await this.verifyBiometricSignature(
          user.id,
          biometricSignature
        );
      }

      if (!isValidCredentials) {
        await this.recordFailedAttempt(email);
        throw new Error("Invalid credentials");
      }

      // Check MFA if enabled
      if (user.mfaEnabled) {
        if (!mfaCode) {
          return {
            user: this.sanitizeUser(user),
            tokens: null,
            requiresMFA: true,
          };
        }

        const isValidMFA = await this.verifyMFACode(
          user.twoFactorSecret,
          mfaCode
        );
        if (!isValidMFA) {
          await this.recordFailedAttempt(email);
          throw new Error("Invalid MFA code");
        }
      }

      // Reset failed attempts
      this.loginAttempts.delete(email);

      // Update user last login
      user.lastLogin = new Date();
      user.loginAttempts = 0;
      await this.updateUser(user);

      // Generate tokens
      const tokens = await this.generateTokens(user, credentials.rememberMe);

      // Create session
      await this.createSession(user.id, tokens.accessToken);

      // Log successful login
      await this.logSecurityEvent({
        type: "user_login",
        userId: user.id,
        ip: this.getCurrentIP(),
        userAgent: this.getCurrentUserAgent(),
        timestamp: new Date(),
      });

      return { user: this.sanitizeUser(user), tokens };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  // === MULTI-FACTOR AUTHENTICATION ===

  // Enable 2FA for user
  async enable2FA(userId: string): Promise<{ secret: string; qrCode: string }> {
    try {
      const user = await this.getUserById(userId);
      if (!user) throw new Error("User not found");

      // Generate TOTP secret
      const secret = authenticator.generateSecret();
      const serviceName = "Crypto Learning Hub";

      // Generate QR code URL
      const otpAuthUrl = authenticator.keyuri(user.email, serviceName, secret);
      const qrCode = await this.generateQRCode(otpAuthUrl);

      // Store secret temporarily (not activated until verified)
      user.tempTwoFactorSecret = secret;
      await this.updateUser(user);

      return { secret, qrCode };
    } catch (error) {
      throw new Error(`Failed to enable 2FA: ${error.message}`);
    }
  }

  // Verify and activate 2FA
  async verify2FA(
    userId: string,
    token: string
  ): Promise<{ backupCodes: string[] }> {
    try {
      const user = await this.getUserById(userId);
      if (!user || !user.tempTwoFactorSecret) {
        throw new Error("2FA setup not initiated");
      }

      // Verify TOTP token
      const isValid = authenticator.verify({
        token,
        secret: user.tempTwoFactorSecret,
        window: 1, // Allow 30 second window
      });

      if (!isValid) {
        throw new Error("Invalid 2FA token");
      }

      // Generate backup codes
      const backupCodes = this.generateBackupCodes();
      const hashedBackupCodes = await Promise.all(
        backupCodes.map((code) => bcrypt.hash(code, 10))
      );

      // Activate 2FA
      user.mfaEnabled = true;
      user.twoFactorSecret = user.tempTwoFactorSecret;
      user.tempTwoFactorSecret = null;
      user.backupCodes = hashedBackupCodes;
      await this.updateUser(user);

      // Log security event
      await this.logSecurityEvent({
        type: "mfa_enabled",
        userId: user.id,
        ip: this.getCurrentIP(),
        timestamp: new Date(),
      });

      return { backupCodes };
    } catch (error) {
      throw new Error(`Failed to verify 2FA: ${error.message}`);
    }
  }

  // Verify MFA code (TOTP or backup code)
  private async verifyMFACode(secret: string, token: string): Promise<boolean> {
    try {
      // First try TOTP verification
      const isValidTOTP = authenticator.verify({
        token,
        secret,
        window: 1,
      });

      if (isValidTOTP) return true;

      // If TOTP fails, check backup codes
      return await this.verifyBackupCode(token);
    } catch (error) {
      return false;
    }
  }

  // === TOKEN MANAGEMENT ===

  // Generate JWT tokens with refresh token rotation
  private async generateTokens(
    user: User,
    longLived = false
  ): Promise<AuthToken> {
    try {
      const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        permissions: await this.getUserPermissions(user.role),
      };

      const accessTokenExpiry = longLived ? "7d" : this.options.tokenExpiry;
      const refreshTokenExpiry = longLived
        ? "30d"
        : this.options.refreshTokenExpiry;

      const accessToken = sign(payload, this.options.jwtSecret, {
        expiresIn: accessTokenExpiry,
        issuer: "crypto-learning-hub",
        audience: "api",
      });

      const refreshToken = sign(
        { userId: user.id, tokenVersion: user.tokenVersion || 0 },
        this.options.refreshTokenSecret,
        { expiresIn: refreshTokenExpiry }
      );

      // Store refresh token hash
      const refreshTokenHash = createHash("sha256")
        .update(refreshToken)
        .digest("hex");
      await this.storeRefreshToken(user.id, refreshTokenHash);

      return {
        accessToken,
        refreshToken,
        expiresIn: this.parseExpiry(accessTokenExpiry),
        tokenType: "Bearer",
      };
    } catch (error) {
      throw new Error(`Token generation failed: ${error.message}`);
    }
  }

  // Refresh access token
  async refreshAccessToken(refreshToken: string): Promise<AuthToken> {
    try {
      // Verify refresh token
      const decoded = verify(
        refreshToken,
        this.options.refreshTokenSecret
      ) as any;

      // Get user and validate token version
      const user = await this.getUserById(decoded.userId);
      if (!user || user.tokenVersion !== decoded.tokenVersion) {
        throw new Error("Invalid refresh token");
      }

      // Verify stored refresh token
      const refreshTokenHash = createHash("sha256")
        .update(refreshToken)
        .digest("hex");
      const isValidRefreshToken = await this.verifyRefreshToken(
        user.id,
        refreshTokenHash
      );

      if (!isValidRefreshToken) {
        throw new Error("Refresh token not found or expired");
      }

      // Revoke old refresh token
      await this.revokeRefreshToken(user.id, refreshTokenHash);

      // Generate new tokens (refresh token rotation)
      const newTokens = await this.generateTokens(user);

      return newTokens;
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  // === BIOMETRIC AUTHENTICATION ===

  // Register biometric signature
  async registerBiometric(
    userId: string,
    biometricData: {
      type: "fingerprint" | "face" | "voice";
      signature: string;
      metadata: any;
    }
  ): Promise<void> {
    try {
      const user = await this.getUserById(userId);
      if (!user) throw new Error("User not found");

      // Encrypt biometric signature
      const encryptedSignature = await this.encryptSensitiveData(
        biometricData.signature
      );

      // Store biometric data
      const biometricRecord = {
        userId,
        type: biometricData.type,
        signature: encryptedSignature,
        metadata: biometricData.metadata,
        createdAt: new Date(),
      };

      await this.storeBiometricData(biometricRecord);

      // Log security event
      await this.logSecurityEvent({
        type: "biometric_registered",
        userId: user.id,
        metadata: { type: biometricData.type },
        ip: this.getCurrentIP(),
        timestamp: new Date(),
      });
    } catch (error) {
      throw new Error(`Biometric registration failed: ${error.message}`);
    }
  }

  // Verify biometric signature
  private async verifyBiometricSignature(
    userId: string,
    signature: string
  ): Promise<boolean> {
    try {
      const storedBiometrics = await this.getBiometricData(userId);

      for (const biometric of storedBiometrics) {
        const decryptedSignature = await this.decryptSensitiveData(
          biometric.signature
        );

        // Use timing-safe comparison to prevent timing attacks
        const isMatch = timingSafeEqual(
          Buffer.from(signature),
          Buffer.from(decryptedSignature)
        );

        if (isMatch) return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  // === SECURITY HELPERS ===

  // Validate password strength
  private validatePasswordStrength(password: string): void {
    const minLength = this.options.passwordMinLength;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password);

    const errors = [];

    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`);
    }
    if (!hasUpperCase) errors.push("Password must contain uppercase letters");
    if (!hasLowerCase) errors.push("Password must contain lowercase letters");
    if (!hasNumbers) errors.push("Password must contain numbers");
    if (!hasSymbols) errors.push("Password must contain special characters");

    // Check against common passwords
    if (this.isCommonPassword(password)) {
      errors.push("Password is too common");
    }

    if (errors.length > 0) {
      throw new Error(`Password validation failed: ${errors.join(", ")}`);
    }
  }

  // Rate limiting
  private checkRateLimit(identifier: string): void {
    const attempt = this.loginAttempts.get(identifier);
    const now = new Date();

    if (attempt) {
      const timeDiff = now.getTime() - attempt.lastAttempt.getTime();
      const lockoutDuration = this.options.lockoutDuration * 1000; // Convert to ms

      if (attempt.count >= this.options.maxLoginAttempts) {
        if (timeDiff < lockoutDuration) {
          const remainingTime = Math.ceil(
            (lockoutDuration - timeDiff) / 1000 / 60
          );
          throw new Error(
            `Too many failed attempts. Try again in ${remainingTime} minutes.`
          );
        } else {
          // Reset after lockout period
          this.loginAttempts.delete(identifier);
        }
      }
    }
  }

  // Record failed login attempt
  private async recordFailedAttempt(identifier: string): Promise<void> {
    const attempt = this.loginAttempts.get(identifier) || {
      count: 0,
      lastAttempt: new Date(),
    };

    attempt.count++;
    attempt.lastAttempt = new Date();

    this.loginAttempts.set(identifier, attempt);

    // Log security event
    await this.logSecurityEvent({
      type: "failed_login_attempt",
      metadata: { identifier, attemptCount: attempt.count },
      ip: this.getCurrentIP(),
      timestamp: new Date(),
    });
  }

  // Generate secure random ID
  private generateSecureId(): string {
    return randomBytes(16).toString("hex");
  }

  // Generate backup codes
  private generateBackupCodes(): string[] {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push(randomBytes(4).toString("hex").toUpperCase());
    }
    return codes;
  }

  // Common password check
  private isCommonPassword(password: string): boolean {
    const commonPasswords = [
      "password",
      "123456",
      "123456789",
      "qwerty",
      "abc123",
      "password123",
      "admin",
      "letmein",
      "welcome",
      "monkey",
    ];
    return commonPasswords.includes(password.toLowerCase());
  }

  // Sanitize user data for API responses
  private sanitizeUser(user: User): Partial<User> {
    const {
      passwordHash,
      twoFactorSecret,
      tempTwoFactorSecret,
      backupCodes,
      ...sanitized
    } = user;
    return sanitized;
  }

  // === ABSTRACT METHODS (implement based on your database) ===
  private async getUserByEmail(email: string): Promise<User | null> {
    throw new Error("Not implemented");
  }
  private async getUserById(id: string): Promise<User | null> {
    throw new Error("Not implemented");
  }
  private async saveUser(user: User): Promise<void> {
    throw new Error("Not implemented");
  }
  private async updateUser(user: User): Promise<void> {
    throw new Error("Not implemented");
  }
  private async getUserPermissions(role: string): Promise<string[]> {
    throw new Error("Not implemented");
  }
  private async storeRefreshToken(
    userId: string,
    tokenHash: string
  ): Promise<void> {
    throw new Error("Not implemented");
  }
  private async verifyRefreshToken(
    userId: string,
    tokenHash: string
  ): Promise<boolean> {
    throw new Error("Not implemented");
  }
  private async revokeRefreshToken(
    userId: string,
    tokenHash: string
  ): Promise<void> {
    throw new Error("Not implemented");
  }
  private async storeBiometricData(data: any): Promise<void> {
    throw new Error("Not implemented");
  }
  private async getBiometricData(userId: string): Promise<any[]> {
    throw new Error("Not implemented");
  }
  private async encryptSensitiveData(data: string): Promise<string> {
    throw new Error("Not implemented");
  }
  private async decryptSensitiveData(encryptedData: string): Promise<string> {
    throw new Error("Not implemented");
  }
  private async createSession(userId: string, token: string): Promise<void> {
    throw new Error("Not implemented");
  }
  private async logSecurityEvent(event: SecurityEvent): Promise<void> {
    throw new Error("Not implemented");
  }
  private async generateQRCode(data: string): Promise<string> {
    throw new Error("Not implemented");
  }
  private async verifyBackupCode(code: string): Promise<boolean> {
    throw new Error("Not implemented");
  }
  private parseExpiry(expiry: string): number {
    throw new Error("Not implemented");
  }
  private getCurrentIP(): string {
    return "127.0.0.1";
  }
  private getCurrentUserAgent(): string {
    return "Unknown";
  }
}
```

### 🛡️ Задание 17.2: Input Validation & Sanitization

#### utils/ValidationService.ts

```typescript
import DOMPurify from "dompurify";
import validator from "validator";
import xss from "xss";

export interface ValidationRule {
  type: "string" | "number" | "email" | "url" | "ethereum_address" | "custom";
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: any) => boolean | string;
  sanitize?: boolean;
  allowedTags?: string[];
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
  sanitizedData: any;
}

export class ValidationService {
  private static instance: ValidationService;

  private constructor() {}

  public static getInstance(): ValidationService {
    if (!ValidationService.instance) {
      ValidationService.instance = new ValidationService();
    }
    return ValidationService.instance;
  }

  // Main validation method
  validate(data: any, schema: ValidationSchema): ValidationResult {
    const errors: Record<string, string[]> = {};
    const sanitizedData: any = {};

    for (const [field, rule] of Object.entries(schema)) {
      const value = data[field];
      const fieldErrors: string[] = [];

      // Check if field is required
      if (
        rule.required &&
        (value === undefined || value === null || value === "")
      ) {
        fieldErrors.push(`${field} is required`);
        continue;
      }

      // Skip validation if field is optional and empty
      if (
        !rule.required &&
        (value === undefined || value === null || value === "")
      ) {
        sanitizedData[field] = value;
        continue;
      }

      // Type-specific validation
      switch (rule.type) {
        case "string":
          const stringValidation = this.validateString(value, rule);
          if (stringValidation.errors.length > 0) {
            fieldErrors.push(...stringValidation.errors);
          }
          sanitizedData[field] = stringValidation.sanitized;
          break;

        case "number":
          const numberValidation = this.validateNumber(value, rule);
          if (numberValidation.errors.length > 0) {
            fieldErrors.push(...numberValidation.errors);
          }
          sanitizedData[field] = numberValidation.sanitized;
          break;

        case "email":
          const emailValidation = this.validateEmail(value, rule);
          if (emailValidation.errors.length > 0) {
            fieldErrors.push(...emailValidation.errors);
          }
          sanitizedData[field] = emailValidation.sanitized;
          break;

        case "url":
          const urlValidation = this.validateURL(value, rule);
          if (urlValidation.errors.length > 0) {
            fieldErrors.push(...urlValidation.errors);
          }
          sanitizedData[field] = urlValidation.sanitized;
          break;

        case "ethereum_address":
          const addressValidation = this.validateEthereumAddress(value, rule);
          if (addressValidation.errors.length > 0) {
            fieldErrors.push(...addressValidation.errors);
          }
          sanitizedData[field] = addressValidation.sanitized;
          break;

        case "custom":
          if (rule.customValidator) {
            const customResult = rule.customValidator(value);
            if (customResult !== true) {
              fieldErrors.push(
                typeof customResult === "string"
                  ? customResult
                  : `${field} is invalid`
              );
            }
          }
          sanitizedData[field] = rule.sanitize
            ? this.sanitizeHTML(value)
            : value;
          break;
      }

      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      sanitizedData,
    };
  }

  // String validation
  private validateString(
    value: any,
    rule: ValidationRule
  ): { errors: string[]; sanitized: any } {
    const errors: string[] = [];
    let sanitized = value;

    // Type check
    if (typeof value !== "string") {
      errors.push("Must be a string");
      return { errors, sanitized: String(value) };
    }

    // Length validation
    if (rule.minLength && value.length < rule.minLength) {
      errors.push(`Must be at least ${rule.minLength} characters long`);
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      errors.push(`Must be no more than ${rule.maxLength} characters long`);
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      errors.push("Format is invalid");
    }

    // Sanitization
    if (rule.sanitize) {
      sanitized = this.sanitizeHTML(value, rule.allowedTags);
    }

    return { errors, sanitized };
  }

  // Number validation
  private validateNumber(
    value: any,
    rule: ValidationRule
  ): { errors: string[]; sanitized: any } {
    const errors: string[] = [];
    let sanitized = value;

    // Convert to number if string
    if (typeof value === "string") {
      sanitized = parseFloat(value);
    }

    // Type check
    if (typeof sanitized !== "number" || isNaN(sanitized)) {
      errors.push("Must be a valid number");
      return { errors, sanitized: 0 };
    }

    return { errors, sanitized };
  }

  // Email validation
  private validateEmail(
    value: any,
    rule: ValidationRule
  ): { errors: string[]; sanitized: any } {
    const errors: string[] = [];
    let sanitized = value;

    // Type check
    if (typeof value !== "string") {
      errors.push("Must be a string");
      return { errors, sanitized: String(value) };
    }

    // Email format validation
    if (!validator.isEmail(value)) {
      errors.push("Must be a valid email address");
    }

    // Normalize email
    sanitized = validator.normalizeEmail(value) || value;

    return { errors, sanitized };
  }

  // URL validation
  private validateURL(
    value: any,
    rule: ValidationRule
  ): { errors: string[]; sanitized: any } {
    const errors: string[] = [];
    let sanitized = value;

    // Type check
    if (typeof value !== "string") {
      errors.push("Must be a string");
      return { errors, sanitized: String(value) };
    }

    // URL format validation
    if (
      !validator.isURL(value, {
        protocols: ["http", "https"],
        require_protocol: true,
      })
    ) {
      errors.push("Must be a valid URL");
    }

    return { errors, sanitized };
  }

  // Ethereum address validation
  private validateEthereumAddress(
    value: any,
    rule: ValidationRule
  ): { errors: string[]; sanitized: any } {
    const errors: string[] = [];
    let sanitized = value;

    // Type check
    if (typeof value !== "string") {
      errors.push("Must be a string");
      return { errors, sanitized: String(value) };
    }

    // Ethereum address format validation
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!ethAddressRegex.test(value)) {
      errors.push("Must be a valid Ethereum address");
    }

    // Normalize to lowercase
    sanitized = value.toLowerCase();

    return { errors, sanitized };
  }

  // HTML sanitization
  private sanitizeHTML(html: string, allowedTags?: string[]): string {
    const defaultAllowedTags = ["b", "i", "em", "strong", "a", "p", "br"];
    const tags = allowedTags || defaultAllowedTags;

    // Configure XSS protection
    const options = {
      allowedTags: tags,
      allowedAttributes: {
        a: ["href", "title"],
      },
      allowedSchemes: ["http", "https", "mailto"],
    };

    return xss(html, options);
  }

  // SQL injection protection
  escapeSQL(value: string): string {
    return value.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
      switch (char) {
        case "\0":
          return "\\0";
        case "\x08":
          return "\\b";
        case "\x09":
          return "\\t";
        case "\x1a":
          return "\\z";
        case "\n":
          return "\\n";
        case "\r":
          return "\\r";
        case '"':
        case "'":
        case "\\":
        case "%":
          return "\\" + char;
        default:
          return char;
      }
    });
  }

  // NoSQL injection protection
  sanitizeMongoQuery(query: any): any {
    if (query && typeof query === "object") {
      for (const key in query) {
        if (key.startsWith("$")) {
          delete query[key];
        } else if (typeof query[key] === "object") {
          query[key] = this.sanitizeMongoQuery(query[key]);
        }
      }
    }
    return query;
  }

  // Command injection protection
  sanitizeCommand(command: string): string {
    // Remove dangerous characters
    return command.replace(/[;&|`$(){}[\]<>]/g, "");
  }

  // Path traversal protection
  sanitizePath(path: string): string {
    // Remove path traversal attempts
    return path.replace(/\.\./g, "").replace(/\/+/g, "/");
  }

  // Content Security Policy header generation
  generateCSPHeader(
    options: {
      allowInlineScripts?: boolean;
      allowInlineStyles?: boolean;
      allowEval?: boolean;
      trustedDomains?: string[];
    } = {}
  ): string {
    const {
      allowInlineScripts = false,
      allowInlineStyles = false,
      allowEval = false,
      trustedDomains = [],
    } = options;

    const directives = [
      "default-src 'self'",
      `script-src 'self' ${allowInlineScripts ? "'unsafe-inline'" : ""} ${allowEval ? "'unsafe-eval'" : ""} ${trustedDomains.join(" ")}`.trim(),
      `style-src 'self' ${allowInlineStyles ? "'unsafe-inline'" : ""} https://fonts.googleapis.com`,
      "img-src 'self' data: https:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' wss: https:",
      "media-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ];

    return directives.join("; ");
  }
}

// Validation schemas for common data types
export const CommonSchemas = {
  userRegistration: {
    email: {
      type: "email" as const,
      required: true,
      sanitize: true,
    },
    password: {
      type: "string" as const,
      required: true,
      minLength: 8,
      maxLength: 128,
      pattern:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    },
    name: {
      type: "string" as const,
      required: true,
      minLength: 2,
      maxLength: 50,
      sanitize: true,
    },
    phone: {
      type: "string" as const,
      required: false,
      pattern: /^\+?[\d\s\-\(\)]+$/,
    },
  },

  walletConnection: {
    address: {
      type: "ethereum_address" as const,
      required: true,
    },
    signature: {
      type: "string" as const,
      required: true,
      pattern: /^0x[a-fA-F0-9]{130}$/,
    },
  },

  tradingOrder: {
    symbol: {
      type: "string" as const,
      required: true,
      pattern: /^[A-Z]{3,10}$/,
    },
    amount: {
      type: "number" as const,
      required: true,
      customValidator: (value: number) =>
        value > 0 || "Amount must be positive",
    },
    price: {
      type: "number" as const,
      required: true,
      customValidator: (value: number) => value > 0 || "Price must be positive",
    },
  },
};
```

### 📊 Критерии оценки

#### Задание 17.1: Advanced Authentication (50 баллов)

- **Отлично (45-50 баллов):**

  - Comprehensive MFA implementation
  - Biometric authentication support
  - Secure session management
  - Advanced rate limiting

- **Хорошо (35-44 балла):**

  - Basic MFA (TOTP) working
  - JWT with refresh tokens
  - Session management
  - Basic rate limiting

- **Удовлетворительно (25-34 балла):**

  - Simple JWT authentication
  - Basic password validation
  - Minimal security measures

- **Неудовлетворительно (0-24 балла):**
  - Authentication не работает
  - Серьезные security vulnerabilities

#### Задание 17.2: Input Validation (50 баллов)

- **Отлично (45-50 баллов):**

  - Comprehensive validation system
  - XSS/SQL injection protection
  - Content Security Policy
  - Multiple sanitization methods

- **Хорошо (35-44 балла):**

  - Basic validation working
  - HTML sanitization
  - Basic XSS protection

- **Удовлетворительно (25-34 балла):**

  - Simple validation
  - Minimal sanitization

- **Неудовлетворительно (0-24 балла):**
  - No proper validation
  - Security vulnerabilities

### 🚀 Дополнительные задачи (бонусы)

1. **Hardware Security Key support** (+20 баллов)
2. **Advanced threat detection** (+15 баллов)
3. **Zero-trust architecture** (+25 баллов)
4. **Security audit logging** (+10 баллов)

### 📚 Материалы для изучения

#### Обязательное чтение:

1. **Security:**

   - "Web Application Security" - Andrew Hoffman
   - OWASP Top 10 Security Risks
   - "Cryptography Engineering" - Ferguson, Schneier, Kohno

2. **Authentication:**
   - OAuth 2.0 and OpenID Connect specifications
   - WebAuthn specification
   - JWT security best practices

### 🎯 Результат этапа

По завершении этого этапа у вас будет:

- ✅ **Enterprise-level security** system
- ✅ **Multi-factor authentication** с biometric support
- ✅ **Comprehensive input validation** и sanitization
- ✅ **Advanced threat protection** от современных атак
- ✅ **Security audit system** для monitoring
