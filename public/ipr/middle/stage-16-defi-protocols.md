# Этап 16: DeFi Protocols & Yield Strategies - Детальные задания

## Задание 16.1: Lending & Borrowing Protocols

### 🎯 Цель

Интегрировать основные DeFi lending протоколы (Compound, Aave) для создания automated yield strategies и portfolio optimization

### 📋 Требования

#### Функциональные требования:

- [ ] Интеграция с Compound и Aave протоколами
- [ ] Automated lending стратегии
- [ ] Collateral management
- [ ] Liquidation protection
- [ ] Yield farming оптимизация

#### Технические требования:

- [ ] Protocol abstractions с унифицированным API
- [ ] Real-time APY мониторинг
- [ ] Gas optimization для batch operations
- [ ] Risk assessment алгоритмы
- [ ] Emergency exit mechanisms

### 🏦 Lending Protocol Service

#### services/LendingProtocolService.ts

```typescript
import { ethers } from "ethers";
import type {
  LendingPosition,
  LendingProtocol,
  YieldStrategy,
  CollateralInfo,
  LiquidationRisk,
  APYData,
} from "@clh/types";

// Compound cToken ABI (simplified)
const CTOKEN_ABI = [
  "function mint(uint256 mintAmount) returns (uint256)",
  "function redeem(uint256 redeemTokens) returns (uint256)",
  "function redeemUnderlying(uint256 redeemAmount) returns (uint256)",
  "function borrow(uint256 borrowAmount) returns (uint256)",
  "function repayBorrow(uint256 repayAmount) returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function balanceOfUnderlying(address owner) returns (uint256)",
  "function borrowBalanceCurrent(address account) returns (uint256)",
  "function supplyRatePerBlock() view returns (uint256)",
  "function borrowRatePerBlock() view returns (uint256)",
  "function exchangeRateCurrent() returns (uint256)",
];

// Aave LendingPool ABI (simplified)
const AAVE_LENDING_POOL_ABI = [
  "function deposit(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)",
  "function withdraw(address asset, uint256 amount, address to) returns (uint256)",
  "function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf)",
  "function repay(address asset, uint256 amount, uint256 rateMode, address onBehalfOf) returns (uint256)",
  "function getUserAccountData(address user) view returns (uint256 totalCollateralETH, uint256 totalDebtETH, uint256 availableBorrowsETH, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)",
  "function getReserveData(address asset) view returns (tuple)",
];

export class LendingProtocolService {
  private provider: ethers.providers.Provider;
  private signer: ethers.Signer;
  private network: string;

  // Protocol addresses by network
  private static PROTOCOL_ADDRESSES = {
    ethereum: {
      compound: {
        comptroller: "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B",
        cTokens: {
          cETH: "0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5",
          cUSDC: "0x39AA39c021dfbaE8faC545936693aC917d5E7563",
          cDAI: "0x5d3a536E4D6DbD6114cc1Ead35777bAB5190C9C0",
          cUSDT: "0xf650C3d88D12dB855b8bf7D11Be6C55A4e07dCC9",
        },
      },
      aave: {
        lendingPool: "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9",
        dataProvider: "0x057835Ad21a177dbdd3090bB1CAE03EaCF78Fc6d",
        aTokens: {
          aUSDC: "0xBcca60bB61934080951369a648Fb03DF4F96263C",
          aDAI: "0x028171bCA77440897B824Ca71D1c56caC55b68A3",
          aUSDT: "0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811",
        },
      },
    },
  };

  constructor(
    provider: ethers.providers.Provider,
    signer: ethers.Signer,
    network: string
  ) {
    this.provider = provider;
    this.signer = signer;
    this.network = network;
  }

  // Get protocol addresses for current network
  private getProtocolAddresses() {
    return LendingProtocolService.PROTOCOL_ADDRESSES[this.network];
  }

  // === COMPOUND INTEGRATION ===

  // Supply to Compound
  async supplyToCompound(
    asset: string,
    amount: string
  ): Promise<ethers.ContractTransaction> {
    try {
      const addresses = this.getProtocolAddresses();
      const cTokenAddress = addresses.compound.cTokens[`c${asset}`];

      if (!cTokenAddress) {
        throw new Error(`Unsupported asset: ${asset}`);
      }

      const cToken = new ethers.Contract(
        cTokenAddress,
        CTOKEN_ABI,
        this.signer
      );

      if (asset === "ETH") {
        // For ETH, send value directly
        const tx = await cToken.mint(0, {
          value: ethers.utils.parseEther(amount),
        });
        return tx;
      } else {
        // For ERC-20 tokens, approve first
        const tokenAddress = await this.getTokenAddress(asset);
        await this.approveToken(tokenAddress, cTokenAddress, amount);

        const amountWei = ethers.utils.parseUnits(
          amount,
          await this.getTokenDecimals(asset)
        );
        const tx = await cToken.mint(amountWei);
        return tx;
      }
    } catch (error) {
      throw new Error(`Compound supply failed: ${error.message}`);
    }
  }

  // Withdraw from Compound
  async withdrawFromCompound(
    asset: string,
    amount: string
  ): Promise<ethers.ContractTransaction> {
    try {
      const addresses = this.getProtocolAddresses();
      const cTokenAddress = addresses.compound.cTokens[`c${asset}`];

      const cToken = new ethers.Contract(
        cTokenAddress,
        CTOKEN_ABI,
        this.signer
      );
      const amountWei = ethers.utils.parseUnits(
        amount,
        await this.getTokenDecimals(asset)
      );

      const tx = await cToken.redeemUnderlying(amountWei);
      return tx;
    } catch (error) {
      throw new Error(`Compound withdrawal failed: ${error.message}`);
    }
  }

  // Borrow from Compound
  async borrowFromCompound(
    asset: string,
    amount: string
  ): Promise<ethers.ContractTransaction> {
    try {
      const addresses = this.getProtocolAddresses();
      const cTokenAddress = addresses.compound.cTokens[`c${asset}`];

      const cToken = new ethers.Contract(
        cTokenAddress,
        CTOKEN_ABI,
        this.signer
      );
      const amountWei = ethers.utils.parseUnits(
        amount,
        await this.getTokenDecimals(asset)
      );

      const tx = await cToken.borrow(amountWei);
      return tx;
    } catch (error) {
      throw new Error(`Compound borrow failed: ${error.message}`);
    }
  }

  // === AAVE INTEGRATION ===

  // Supply to Aave
  async supplyToAave(
    asset: string,
    amount: string
  ): Promise<ethers.ContractTransaction> {
    try {
      const addresses = this.getProtocolAddresses();
      const lendingPool = new ethers.Contract(
        addresses.aave.lendingPool,
        AAVE_LENDING_POOL_ABI,
        this.signer
      );

      const tokenAddress = await this.getTokenAddress(asset);
      const amountWei = ethers.utils.parseUnits(
        amount,
        await this.getTokenDecimals(asset)
      );

      // Approve token spending
      await this.approveToken(tokenAddress, addresses.aave.lendingPool, amount);

      const userAddress = await this.signer.getAddress();
      const tx = await lendingPool.deposit(
        tokenAddress,
        amountWei,
        userAddress,
        0
      );

      return tx;
    } catch (error) {
      throw new Error(`Aave supply failed: ${error.message}`);
    }
  }

  // Withdraw from Aave
  async withdrawFromAave(
    asset: string,
    amount: string
  ): Promise<ethers.ContractTransaction> {
    try {
      const addresses = this.getProtocolAddresses();
      const lendingPool = new ethers.Contract(
        addresses.aave.lendingPool,
        AAVE_LENDING_POOL_ABI,
        this.signer
      );

      const tokenAddress = await this.getTokenAddress(asset);
      const amountWei = ethers.utils.parseUnits(
        amount,
        await this.getTokenDecimals(asset)
      );
      const userAddress = await this.signer.getAddress();

      const tx = await lendingPool.withdraw(
        tokenAddress,
        amountWei,
        userAddress
      );
      return tx;
    } catch (error) {
      throw new Error(`Aave withdrawal failed: ${error.message}`);
    }
  }

  // Get lending positions across protocols
  async getLendingPositions(userAddress: string): Promise<LendingPosition[]> {
    try {
      const [compoundPositions, aavePositions] = await Promise.all([
        this.getCompoundPositions(userAddress),
        this.getAavePositions(userAddress),
      ]);

      return [...compoundPositions, ...aavePositions];
    } catch (error) {
      throw new Error(`Failed to get lending positions: ${error.message}`);
    }
  }

  // Get Compound positions
  private async getCompoundPositions(
    userAddress: string
  ): Promise<LendingPosition[]> {
    const addresses = this.getProtocolAddresses();
    const positions: LendingPosition[] = [];

    for (const [asset, cTokenAddress] of Object.entries(
      addresses.compound.cTokens
    )) {
      try {
        const cToken = new ethers.Contract(
          cTokenAddress,
          CTOKEN_ABI,
          this.provider
        );

        const [balance, borrowBalance, supplyRate, borrowRate] =
          await Promise.all([
            cToken.balanceOfUnderlying(userAddress),
            cToken.borrowBalanceCurrent(userAddress),
            cToken.supplyRatePerBlock(),
            cToken.borrowRatePerBlock(),
          ]);

        if (balance.gt(0) || borrowBalance.gt(0)) {
          const assetSymbol = asset.substring(1); // Remove 'c' prefix

          positions.push({
            protocol: "compound",
            asset: assetSymbol,
            supplied: ethers.utils.formatUnits(
              balance,
              await this.getTokenDecimals(assetSymbol)
            ),
            borrowed: ethers.utils.formatUnits(
              borrowBalance,
              await this.getTokenDecimals(assetSymbol)
            ),
            supplyAPY: this.calculateAPYFromRate(supplyRate),
            borrowAPY: this.calculateAPYFromRate(borrowRate),
            cTokenAddress,
          });
        }
      } catch (error) {
        console.warn(`Failed to get position for ${asset}:`, error);
      }
    }

    return positions;
  }

  // Get Aave positions
  private async getAavePositions(
    userAddress: string
  ): Promise<LendingPosition[]> {
    const addresses = this.getProtocolAddresses();
    const lendingPool = new ethers.Contract(
      addresses.aave.lendingPool,
      AAVE_LENDING_POOL_ABI,
      this.provider
    );

    try {
      const accountData = await lendingPool.getUserAccountData(userAddress);

      // Get detailed positions from data provider
      // This is a simplified version - in production, you'd get detailed asset breakdown

      return [
        {
          protocol: "aave",
          asset: "multiple",
          supplied: ethers.utils.formatEther(accountData.totalCollateralETH),
          borrowed: ethers.utils.formatEther(accountData.totalDebtETH),
          supplyAPY: 0, // Would be calculated from reserve data
          borrowAPY: 0, // Would be calculated from reserve data
          healthFactor: ethers.utils.formatUnits(accountData.healthFactor, 18),
        },
      ];
    } catch (error) {
      console.warn("Failed to get Aave positions:", error);
      return [];
    }
  }

  // Calculate liquidation risk
  async calculateLiquidationRisk(
    userAddress: string
  ): Promise<LiquidationRisk> {
    try {
      const positions = await this.getLendingPositions(userAddress);

      let totalCollateral = 0;
      let totalDebt = 0;
      let weightedLiquidationThreshold = 0;

      for (const position of positions) {
        const suppliedValue =
          parseFloat(position.supplied) *
          (await this.getAssetPrice(position.asset));
        const borrowedValue =
          parseFloat(position.borrowed) *
          (await this.getAssetPrice(position.asset));

        totalCollateral += suppliedValue;
        totalDebt += borrowedValue;

        // Simplified - would use actual liquidation thresholds
        weightedLiquidationThreshold += suppliedValue * 0.8; // 80% threshold
      }

      const healthFactor =
        totalDebt > 0 ? weightedLiquidationThreshold / totalDebt : Infinity;
      const liquidationPrice = totalDebt > 0 ? totalDebt / 0.8 : 0; // Price where liquidation occurs

      return {
        healthFactor,
        liquidationThreshold: weightedLiquidationThreshold,
        totalCollateral,
        totalDebt,
        liquidationPrice,
        riskLevel: this.assessRiskLevel(healthFactor),
      };
    } catch (error) {
      throw new Error(`Failed to calculate liquidation risk: ${error.message}`);
    }
  }

  // Get best yield opportunities
  async getBestYieldOpportunities(): Promise<YieldStrategy[]> {
    try {
      const [compoundRates, aaveRates] = await Promise.all([
        this.getCompoundRates(),
        this.getAaveRates(),
      ]);

      const opportunities: YieldStrategy[] = [];

      // Compare rates and find arbitrage opportunities
      for (const asset in compoundRates) {
        const compoundSupply = compoundRates[asset].supply;
        const compoundBorrow = compoundRates[asset].borrow;
        const aaveSupply = aaveRates[asset]?.supply || 0;
        const aaveBorrow = aaveRates[asset]?.borrow || 0;

        // Simple yield farming strategy
        if (compoundSupply > aaveSupply) {
          opportunities.push({
            type: "yield-farming",
            protocol: "compound",
            asset,
            expectedAPY: compoundSupply,
            risk: "low",
            description: `Supply ${asset} to Compound for ${compoundSupply.toFixed(2)}% APY`,
          });
        }

        // Leverage yield farming (borrow from cheaper protocol, lend to expensive one)
        if (compoundSupply - aaveBorrow > 2) {
          // 2% spread minimum
          opportunities.push({
            type: "leverage-farming",
            protocol: "multi",
            asset,
            expectedAPY: compoundSupply - aaveBorrow,
            risk: "medium",
            description: `Borrow ${asset} from Aave (${aaveBorrow.toFixed(2)}%) and supply to Compound (${compoundSupply.toFixed(2)}%)`,
          });
        }
      }

      return opportunities.sort((a, b) => b.expectedAPY - a.expectedAPY);
    } catch (error) {
      throw new Error(`Failed to get yield opportunities: ${error.message}`);
    }
  }

  // Helper methods
  private async getCompoundRates(): Promise<Record<string, APYData>> {
    const addresses = this.getProtocolAddresses();
    const rates: Record<string, APYData> = {};

    for (const [asset, cTokenAddress] of Object.entries(
      addresses.compound.cTokens
    )) {
      try {
        const cToken = new ethers.Contract(
          cTokenAddress,
          CTOKEN_ABI,
          this.provider
        );
        const [supplyRate, borrowRate] = await Promise.all([
          cToken.supplyRatePerBlock(),
          cToken.borrowRatePerBlock(),
        ]);

        const assetSymbol = asset.substring(1);
        rates[assetSymbol] = {
          supply: this.calculateAPYFromRate(supplyRate),
          borrow: this.calculateAPYFromRate(borrowRate),
        };
      } catch (error) {
        console.warn(`Failed to get rates for ${asset}:`, error);
      }
    }

    return rates;
  }

  private async getAaveRates(): Promise<Record<string, APYData>> {
    // Simplified - would use Aave's data provider to get actual rates
    return {
      USDC: { supply: 2.5, borrow: 4.2 },
      DAI: { supply: 2.8, borrow: 4.5 },
      USDT: { supply: 2.3, borrow: 4.0 },
    };
  }

  private calculateAPYFromRate(ratePerBlock: ethers.BigNumber): number {
    // Compound: blocks per year * rate per block
    const blocksPerYear = 2102400; // Approximate blocks per year
    const rate = parseFloat(ethers.utils.formatUnits(ratePerBlock, 18));
    return (Math.pow(1 + rate * blocksPerYear, 1) - 1) * 100;
  }

  private assessRiskLevel(
    healthFactor: number
  ): "low" | "medium" | "high" | "critical" {
    if (healthFactor > 2) return "low";
    if (healthFactor > 1.5) return "medium";
    if (healthFactor > 1.1) return "high";
    return "critical";
  }

  private async getTokenAddress(symbol: string): Promise<string> {
    // Token addresses mapping - would be in config
    const tokenAddresses = {
      USDC: "0xA0b86a33E6441d9f7e8F76C1B8dB8c8b4C44A5e5",
      DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    };
    return tokenAddresses[symbol];
  }

  private async getTokenDecimals(symbol: string): Promise<number> {
    const decimals = {
      ETH: 18,
      USDC: 6,
      DAI: 18,
      USDT: 6,
    };
    return decimals[symbol] || 18;
  }

  private async getAssetPrice(symbol: string): Promise<number> {
    // Would integrate with price oracle
    return 1; // Simplified
  }

  private async approveToken(
    tokenAddress: string,
    spenderAddress: string,
    amount: string
  ): Promise<void> {
    // Token approval logic
  }
}
```

### 💰 Задание 16.2: Yield Farming Automation

#### composables/useYieldFarming.ts

```typescript
import { ref, computed, watch } from "vue";
import type {
  YieldFarm,
  FarmingStrategy,
  RewardToken,
  LiquidityPosition,
  ImpermanentLoss,
} from "@clh/types";

export interface UseYieldFarmingReturn {
  activeFarms: Readonly<Ref<YieldFarm[]>>;
  userPositions: Readonly<Ref<LiquidityPosition[]>>;
  totalYield: Readonly<Ref<number>>;
  impermanentLoss: Readonly<Ref<ImpermanentLoss>>;

  // Actions
  enterFarm: (farm: YieldFarm, amount: string) => Promise<void>;
  exitFarm: (positionId: string) => Promise<void>;
  claimRewards: (positionId: string) => Promise<void>;
  compoundRewards: (positionId: string) => Promise<void>;
  rebalancePosition: (positionId: string) => Promise<void>;

  // Analytics
  calculateOptimalAllocation: (portfolio: any) => Promise<FarmingStrategy>;
  predictYield: (
    farm: YieldFarm,
    amount: string,
    days: number
  ) => Promise<number>;
  assessRisk: (farm: YieldFarm) => Promise<string>;
}

export function useYieldFarming(): UseYieldFarmingReturn {
  const { provider, signer } = useWeb3();
  const lendingService = new LendingProtocolService(
    provider.value,
    signer.value,
    "ethereum"
  );

  // State
  const activeFarms = ref<YieldFarm[]>([]);
  const userPositions = ref<LiquidityPosition[]>([]);
  const totalYield = ref(0);
  const impermanentLoss = ref<ImpermanentLoss>({ current: 0, percentage: 0 });

  // Popular yield farming protocols
  const YIELD_PROTOCOLS = {
    curve: {
      name: "Curve Finance",
      pools: [
        {
          id: "curve-3pool",
          name: "3Pool (USDC/USDT/DAI)",
          tokens: ["USDC", "USDT", "DAI"],
          apy: 8.5,
          tvl: 1200000000,
          risk: "low",
          strategy: "stable-lp",
        },
        {
          id: "curve-steth",
          name: "stETH Pool",
          tokens: ["ETH", "stETH"],
          apy: 12.3,
          tvl: 800000000,
          risk: "medium",
          strategy: "eth-lsd",
        },
      ],
    },
    convex: {
      name: "Convex Finance",
      baseProtocol: "curve",
      boostMultiplier: 2.5,
    },
    yearn: {
      name: "Yearn Finance",
      vaults: [
        {
          id: "yearn-usdc",
          name: "USDC Vault",
          token: "USDC",
          apy: 6.8,
          strategy: "automated",
        },
      ],
    },
  };

  // Enter yield farm
  const enterFarm = async (farm: YieldFarm, amount: string) => {
    try {
      switch (farm.protocol) {
        case "curve":
          await enterCurveFarm(farm, amount);
          break;
        case "convex":
          await enterConvexFarm(farm, amount);
          break;
        case "yearn":
          await enterYearnVault(farm, amount);
          break;
        default:
          throw new Error(`Unsupported protocol: ${farm.protocol}`);
      }

      await refreshPositions();
    } catch (error) {
      throw new Error(`Failed to enter farm: ${error.message}`);
    }
  };

  // Enter Curve liquidity pool
  const enterCurveFarm = async (farm: YieldFarm, amount: string) => {
    // Curve pool contract integration
    const curvePoolABI = [
      "function add_liquidity(uint256[3] amounts, uint256 min_mint_amount)",
      "function remove_liquidity(uint256 _amount, uint256[3] min_amounts)",
      "function get_virtual_price() view returns (uint256)",
    ];

    const poolContract = new ethers.Contract(
      farm.contractAddress,
      curvePoolABI,
      signer.value
    );

    // Calculate optimal amounts for each token in the pool
    const amounts = await calculateOptimalAmounts(farm, amount);
    const minMintAmount = await calculateMinLPTokens(farm, amounts);

    // Add liquidity to Curve pool
    const tx = await poolContract.add_liquidity(amounts, minMintAmount);
    await tx.wait();

    // Stake LP tokens in gauge if available
    if (farm.gaugeAddress) {
      await stakeLPTokens(farm.gaugeAddress, tx);
    }
  };

  // Enter Convex farm (Curve + Convex rewards)
  const enterConvexFarm = async (farm: YieldFarm, amount: string) => {
    // First enter Curve pool
    await enterCurveFarm(farm, amount);

    // Then stake in Convex for boosted rewards
    const convexBoosterABI = [
      "function deposit(uint256 _pid, uint256 _amount, bool _stake)",
    ];

    const convexBooster = new ethers.Contract(
      "0xF403C135812408BFbE8713b5A23a04b3D48AAE31", // Convex Booster
      convexBoosterABI,
      signer.value
    );

    // Get LP token balance and stake in Convex
    const lpTokenBalance = await getLPTokenBalance(farm);
    const tx = await convexBooster.deposit(
      farm.convexPoolId,
      lpTokenBalance,
      true
    );
    await tx.wait();
  };

  // Enter Yearn vault
  const enterYearnVault = async (farm: YieldFarm, amount: string) => {
    const yearnVaultABI = [
      "function deposit(uint256 _amount) returns (uint256)",
      "function withdraw(uint256 _shares) returns (uint256)",
      "function pricePerShare() view returns (uint256)",
    ];

    const vaultContract = new ethers.Contract(
      farm.contractAddress,
      yearnVaultABI,
      signer.value
    );

    // Approve token spending
    await approveToken(farm.token, farm.contractAddress, amount);

    // Deposit into vault
    const amountWei = ethers.utils.parseUnits(
      amount,
      await getTokenDecimals(farm.token)
    );
    const tx = await vaultContract.deposit(amountWei);
    await tx.wait();
  };

  // Calculate optimal portfolio allocation
  const calculateOptimalAllocation = async (
    portfolio: any
  ): Promise<FarmingStrategy> => {
    try {
      const availableFarms = await getAvailableFarms();
      const riskProfile = assessPortfolioRisk(portfolio);

      // Risk-adjusted portfolio optimization
      const allocation = optimizeAllocation(
        availableFarms,
        portfolio.totalValue,
        riskProfile
      );

      return {
        allocations: allocation,
        expectedAPY: calculateWeightedAPY(allocation),
        riskScore: calculateRiskScore(allocation),
        rebalanceFrequency: "weekly",
        exitStrategy: generateExitStrategy(allocation),
      };
    } catch (error) {
      throw new Error(`Portfolio optimization failed: ${error.message}`);
    }
  };

  // Automated rebalancing
  const rebalancePosition = async (positionId: string) => {
    try {
      const position = userPositions.value.find((p) => p.id === positionId);
      if (!position) throw new Error("Position not found");

      // Check if rebalancing is needed
      const currentAllocation = await getCurrentAllocation(position);
      const optimalAllocation = await calculateOptimalAllocation(position);

      const deviation = calculateAllocationDeviation(
        currentAllocation,
        optimalAllocation
      );

      if (deviation > 0.05) {
        // 5% threshold
        await executeRebalancing(position, optimalAllocation);
      }
    } catch (error) {
      throw new Error(`Rebalancing failed: ${error.message}`);
    }
  };

  // Impermanent loss calculation
  const calculateImpermanentLoss = async (
    position: LiquidityPosition
  ): Promise<ImpermanentLoss> => {
    try {
      const currentPrices = await getCurrentTokenPrices(position.tokens);
      const initialPrices = position.initialPrices;

      // Calculate price ratios
      const priceRatio = currentPrices[0] / currentPrices[1];
      const initialRatio = initialPrices[0] / initialPrices[1];
      const ratioChange = priceRatio / initialRatio;

      // Calculate impermanent loss
      const multiplier = (2 * Math.sqrt(ratioChange)) / (1 + ratioChange);
      const impermanentLoss = (multiplier - 1) * 100;

      // Calculate absolute loss in USD
      const holdValue =
        (position.initialValue *
          (currentPrices[0] / initialPrices[0] +
            currentPrices[1] / initialPrices[1])) /
        2;
      const lpValue = await getLPTokenValue(position);
      const absoluteLoss = holdValue - lpValue;

      return {
        percentage: impermanentLoss,
        current: absoluteLoss,
        threshold: -5, // Alert if IL > 5%
      };
    } catch (error) {
      console.error("IL calculation failed:", error);
      return { percentage: 0, current: 0 };
    }
  };

  // Automated compound strategy
  const compoundRewards = async (positionId: string) => {
    try {
      const position = userPositions.value.find((p) => p.id === positionId);
      if (!position) throw new Error("Position not found");

      // Claim all pending rewards
      const rewards = await claimAllRewards(position);

      // Convert rewards to base tokens if needed
      const baseTokens = await convertRewardsToBaseTokens(rewards, position);

      // Add liquidity back to the pool
      await reinvestTokens(position, baseTokens);

      console.log(
        `Compounded ${baseTokens.total} tokens for position ${positionId}`
      );
    } catch (error) {
      throw new Error(`Compounding failed: ${error.message}`);
    }
  };

  // Risk assessment
  const assessRisk = async (farm: YieldFarm): Promise<string> => {
    try {
      const factors = {
        protocolRisk: assessProtocolSecurity(farm.protocol),
        liquidityRisk: await assessLiquidityRisk(farm),
        impermanentLoss: await assessILRisk(farm.tokens),
        smartContractRisk: await assessSmartContractRisk(farm.contractAddress),
        governanceRisk: assessGovernanceRisk(farm.protocol),
      };

      const riskScore =
        Object.values(factors).reduce((sum, score) => sum + score, 0) / 5;

      if (riskScore < 3) return "low";
      if (riskScore < 6) return "medium";
      if (riskScore < 8) return "high";
      return "critical";
    } catch (error) {
      console.warn("Risk assessment failed:", error);
      return "unknown";
    }
  };

  // Helper functions
  const optimizeAllocation = (
    farms: YieldFarm[],
    totalValue: number,
    riskProfile: string
  ) => {
    // Modern Portfolio Theory implementation
    // This is a simplified version - production would use more sophisticated optimization

    const filteredFarms = farms.filter((farm) => {
      if (riskProfile === "conservative") return farm.risk === "low";
      if (riskProfile === "moderate")
        return ["low", "medium"].includes(farm.risk);
      return true; // aggressive
    });

    // Optimize for maximum Sharpe ratio
    return filteredFarms.map((farm) => ({
      farmId: farm.id,
      allocation: calculateOptimalWeight(farm, totalValue),
      expectedReturn: farm.apy,
      risk: farm.risk,
    }));
  };

  const calculateOptimalWeight = (
    farm: YieldFarm,
    totalValue: number
  ): number => {
    // Kelly Criterion or mean-variance optimization
    const maxAllocation = {
      low: 0.4, // 40% max for low risk
      medium: 0.25, // 25% max for medium risk
      high: 0.15, // 15% max for high risk
    };

    return Math.min(maxAllocation[farm.risk], totalValue * 0.1); // 10% base allocation
  };

  // Auto-refresh positions
  const refreshPositions = async () => {
    try {
      const userAddress = await signer.value?.getAddress();
      if (!userAddress) return;

      const positions = await getAllUserPositions(userAddress);
      userPositions.value = positions;

      const totalValue = positions.reduce(
        (sum, pos) => sum + pos.currentValue,
        0
      );
      totalYield.value = totalValue;
    } catch (error) {
      console.error("Failed to refresh positions:", error);
    }
  };

  // Watch for account changes
  watch(() => signer.value, refreshPositions, { immediate: true });

  return {
    activeFarms: readonly(activeFarms),
    userPositions: readonly(userPositions),
    totalYield: readonly(totalYield),
    impermanentLoss: readonly(impermanentLoss),

    enterFarm,
    exitFarm,
    claimRewards,
    compoundRewards,
    rebalancePosition,

    calculateOptimalAllocation,
    predictYield,
    assessRisk,
  };
}
```

### 📊 Критерии оценки

#### Задание 16.1: Lending Protocols (50 баллов)

- **Отлично (45-50 баллов):**

  - Полная интеграция с Compound и Aave
  - Automated liquidation protection
  - Risk assessment алгоритмы
  - Cross-protocol yield optimization

- **Хорошо (35-44 балла):**

  - Основные lending операции работают
  - Базовый risk assessment
  - Простая автоматизация

- **Удовлетворительно (25-34 балла):**

  - Один протокол интегрирован
  - Ручные операции

- **Неудовлетворительно (0-24 балла):**
  - Lending не работает
  - Серьезные ошибки

#### Задание 16.2: Yield Farming Automation (50 баллов)

- **Отлично (45-50 баллов):**

  - Multi-protocol yield farming
  - Automated rebalancing
  - Impermanent loss protection
  - Portfolio optimization

- **Хорошо (35-44 балла):**

  - Работает yield farming
  - Базовая автоматизация
  - Простая оптимизация

- **Удовлетворительно (25-34 балла):**

  - Ручное управление фармингом
  - Минимальная автоматизация

- **Неудовлетворительно (0-24 балла):**
  - Farming не работает
  - Отсутствует автоматизация

### 🚀 Дополнительные задачи (бонусы)

1. **Flash loan arbitrage** (+25 баллов)
2. **Cross-chain yield farming** (+20 баллов)
3. **MEV protection strategies** (+15 баллов)
4. **AI-powered yield optimization** (+30 баллов)

### 📚 Материалы для изучения

#### Обязательное чтение:

1. **DeFi Protocols:**

   - "How to DeFi" guide series
   - Compound Protocol documentation
   - Aave Protocol documentation

2. **Yield Farming:**
   - "Yield Farming for Dummies"
   - Curve Finance documentation
   - Convex Finance strategies

### 🎯 Результат этапа

По завершении этого этапа у вас будет:

- ✅ **Полная DeFi интеграция** с lending протоколами
- ✅ **Automated yield strategies** с rebalancing
- ✅ **Risk management system** с liquidation protection
- ✅ **Portfolio optimization** алгоритмы
- ✅ **Production-ready DeFi features** для enterprise использования
