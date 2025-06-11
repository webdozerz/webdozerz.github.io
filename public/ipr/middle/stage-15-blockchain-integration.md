# Этап 15: Интеграция блокчейна и Web3 - Детальные задания

## Задание 15.1: Поставщик Web3 и интеграция кошелька

### 🎯 Цель

Создать комплексную систему подключения к различным криптовалютным кошелькам и блокчейн сетям с поддержкой множественных провайдеров

### 📋 Требования

#### Функциональные требования:

- [ ] Подключение MetaMask, WalletConnect, Кошелек Coinbase
- [ ] Поддержка множественных сетей (Ethereum, BSC, Polygon, Arbitrum)
- [ ] Автоматическое переключение сетей
- [ ] Обработка ошибок подключения
- [ ] Persistent сессии кошелька

#### Технические требования:

- [ ] Типизация TypeScript для всех операций Web3
- [ ] Событийно-ориентированная архитектура для событий блокчейна
- [ ] Эффективное объединение подключений
- [ ] Обработка ошибок и логика повторных попыток
- [ ] Лучшие практики безопасности

### 🔗 Служба Web3 провайдера

#### composables/useWeb3.ts

```typescript
import { ref, computed, watch, onUnmounted } from "vue";
import { ethers } from "ethers";
import type {
  WalletProvider,
  SupportedNetwork,
  WalletConnection,
  NetworkConfig,
  TransactionRequest,
  TransactionResponse,
} from "@clh/types";

export interface UseWeb3Return {
  // State
  isConnected: Readonly<Ref<boolean>>;
  currentAccount: Readonly<Ref<string | null>>;
  currentNetwork: Readonly<Ref<SupportedNetwork | null>>;
  balance: Readonly<Ref<string>>;
  isConnecting: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | null>>;

  // Provider
  provider: Readonly<Ref<ethers.providers.Web3Provider | null>>;
  signer: Readonly<Ref<ethers.Signer | null>>;

  // Methods
  connectWallet: (providerType: WalletProvider) => Promise<WalletConnection>;
  disconnectWallet: () => Promise<void>;
  switchNetwork: (network: SupportedNetwork) => Promise<void>;
  sendTransaction: (
    transaction: TransactionRequest
  ) => Promise<TransactionResponse>;
  signMessage: (message: string) => Promise<string>;
  addToken: (tokenAddress: string) => Promise<void>;

  // Utils
  formatBalance: (balance: string, decimals?: number) => string;
  isValidAddress: (address: string) => boolean;
  getExplorerUrl: (txHash: string, network?: SupportedNetwork) => string;
}

// Supported networks configuration
const NETWORKS: Record<SupportedNetwork, NetworkConfig> = {
  ethereum: {
    chainId: "0x1",
    chainName: "Ethereum Mainnet",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://mainnet.infura.io/v3/YOUR_INFURA_KEY"],
    blockExplorerUrls: ["https://etherscan.io"],
  },
  bsc: {
    chainId: "0x38",
    chainName: "Binance Smart Chain",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
    blockExplorerUrls: ["https://bscscan.com"],
  },
  polygon: {
    chainId: "0x89",
    chainName: "Polygon Mainnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://polygon-rpc.com/"],
    blockExplorerUrls: ["https://polygonscan.com"],
  },
  arbitrum: {
    chainId: "0xa4b1",
    chainName: "Arbitrum One",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://arbiscan.io"],
  },
};

export function useWeb3(): UseWeb3Return {
  // Reactive state
  const isConnected = ref(false);
  const currentAccount = ref<string | null>(null);
  const currentNetwork = ref<SupportedNetwork | null>(null);
  const balance = ref("0");
  const isConnecting = ref(false);
  const error = ref<string | null>(null);
  const provider = ref<ethers.providers.Web3Provider | null>(null);
  const signer = ref<ethers.Signer | null>(null);

  // Event listeners map
  const eventListeners = new Map<string, Function>();

  // Check if wallet is already connected
  const checkConnection = async () => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length > 0) {
          await initializeProvider();
          currentAccount.value = accounts[0];
          isConnected.value = true;
          await updateBalance();
          await getCurrentNetwork();
        }
      }
    } catch (err) {
      console.error("Error checking wallet connection:", err);
    }
  };

  // Initialize provider
  const initializeProvider = async () => {
    if (!window.ethereum) {
      throw new Error("No Web3 provider found");
    }

    provider.value = new ethers.providers.Web3Provider(window.ethereum);
    signer.value = provider.value.getSigner();

    // Setup event listeners
    setupEventListeners();
  };

  // Setup blockchain event listeners
  const setupEventListeners = () => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== currentAccount.value) {
        currentAccount.value = accounts[0];
        updateBalance();
      }
    };

    const handleChainChanged = (chainId: string) => {
      const network = Object.entries(NETWORKS).find(
        ([_, config]) => config.chainId === chainId
      )?.[0] as SupportedNetwork;

      if (network) {
        currentNetwork.value = network;
        updateBalance();
      } else {
        error.value = `Unsupported network: ${chainId}`;
      }
    };

    const handleDisconnect = () => {
      disconnectWallet();
    };

    // Add listeners
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    window.ethereum.on("disconnect", handleDisconnect);

    // Store references for cleanup
    eventListeners.set("accountsChanged", handleAccountsChanged);
    eventListeners.set("chainChanged", handleChainChanged);
    eventListeners.set("disconnect", handleDisconnect);
  };

  // Connect wallet
  const connectWallet = async (
    providerType: WalletProvider
  ): Promise<WalletConnection> => {
    try {
      isConnecting.value = true;
      error.value = null;

      let ethereum: any;

      switch (providerType) {
        case "metamask":
          if (!window.ethereum?.isMetaMask) {
            throw new Error("MetaMask not found. Please install MetaMask.");
          }
          ethereum = window.ethereum;
          break;

        case "walletconnect":
          // WalletConnect integration
          const WalletConnect = (await import("@walletconnect/web3-provider"))
            .default;
          ethereum = new WalletConnect({
            infuraId: process.env.NUXT_PUBLIC_INFURA_ID,
          });
          await ethereum.enable();
          break;

        case "coinbase":
          if (!window.ethereum?.isCoinbaseWallet) {
            throw new Error("Coinbase Wallet not found.");
          }
          ethereum = window.ethereum;
          break;

        default:
          throw new Error(`Unsupported provider: ${providerType}`);
      }

      // Request account access
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        throw new Error("No accounts found");
      }

      // Update global ethereum reference
      if (providerType !== "walletconnect") {
        window.ethereum = ethereum;
      }

      await initializeProvider();

      currentAccount.value = accounts[0];
      isConnected.value = true;

      await updateBalance();
      await getCurrentNetwork();

      // Store connection info in localStorage
      localStorage.setItem("connectedWallet", providerType);
      localStorage.setItem("connectedAccount", accounts[0]);

      const connection: WalletConnection = {
        provider: providerType,
        account: accounts[0],
        network: currentNetwork.value!,
        balance: balance.value,
      };

      return connection;
    } catch (err: any) {
      error.value = err.message || "Failed to connect wallet";
      throw err;
    } finally {
      isConnecting.value = false;
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      // Remove event listeners
      if (window.ethereum) {
        eventListeners.forEach((listener, event) => {
          window.ethereum.removeListener(event, listener);
        });
        eventListeners.clear();
      }

      // Reset state
      isConnected.value = false;
      currentAccount.value = null;
      currentNetwork.value = null;
      balance.value = "0";
      provider.value = null;
      signer.value = null;
      error.value = null;

      // Clear localStorage
      localStorage.removeItem("connectedWallet");
      localStorage.removeItem("connectedAccount");
    } catch (err) {
      console.error("Error disconnecting wallet:", err);
    }
  };

  // Switch network
  const switchNetwork = async (network: SupportedNetwork) => {
    try {
      if (!window.ethereum) {
        throw new Error("No Web3 provider found");
      }

      const networkConfig = NETWORKS[network];

      try {
        // Try to switch to the network
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: networkConfig.chainId }],
        });
      } catch (switchError: any) {
        // If network is not added, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [networkConfig],
          });
        } else {
          throw switchError;
        }
      }

      currentNetwork.value = network;
      await updateBalance();
    } catch (err: any) {
      error.value = err.message || "Failed to switch network";
      throw err;
    }
  };

  // Update balance
  const updateBalance = async () => {
    try {
      if (provider.value && currentAccount.value) {
        const balance = await provider.value.getBalance(currentAccount.value);
        balance.value = ethers.utils.formatEther(balance);
      }
    } catch (err) {
      console.error("Error updating balance:", err);
    }
  };

  // Get current network
  const getCurrentNetwork = async () => {
    try {
      if (provider.value) {
        const network = await provider.value.getNetwork();
        const foundNetwork = Object.entries(NETWORKS).find(
          ([_, config]) =>
            config.chainId === `0x${network.chainId.toString(16)}`
        )?.[0] as SupportedNetwork;

        if (foundNetwork) {
          currentNetwork.value = foundNetwork;
        }
      }
    } catch (err) {
      console.error("Error getting network:", err);
    }
  };

  // Send transaction
  const sendTransaction = async (
    transaction: TransactionRequest
  ): Promise<TransactionResponse> => {
    try {
      if (!signer.value) {
        throw new Error("Wallet not connected");
      }

      const tx = await signer.value.sendTransaction({
        to: transaction.to,
        value: transaction.value
          ? ethers.utils.parseEther(transaction.value.toString())
          : undefined,
        data: transaction.data,
        gasLimit: transaction.gasLimit,
        gasPrice: transaction.gasPrice,
      });

      return {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value.toString(),
        gasLimit: tx.gasLimit.toString(),
        gasPrice: tx.gasPrice?.toString(),
        nonce: tx.nonce,
        blockNumber: tx.blockNumber,
        blockHash: tx.blockHash,
        timestamp: Date.now(),
        status: "pending",
      };
    } catch (err: any) {
      throw new Error(err.message || "Transaction failed");
    }
  };

  // Sign message
  const signMessage = async (message: string): Promise<string> => {
    try {
      if (!signer.value) {
        throw new Error("Wallet not connected");
      }

      return await signer.value.signMessage(message);
    } catch (err: any) {
      throw new Error(err.message || "Message signing failed");
    }
  };

  // Add token to wallet
  const addToken = async (tokenAddress: string) => {
    try {
      if (!window.ethereum) {
        throw new Error("No Web3 provider found");
      }

      // Get token details
      const contract = new ethers.Contract(
        tokenAddress,
        [
          "function symbol() view returns (string)",
          "function decimals() view returns (uint8)",
        ],
        provider.value
      );

      const symbol = await contract.symbol();
      const decimals = await contract.decimals();

      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol,
            decimals,
          },
        },
      });
    } catch (err: any) {
      throw new Error(err.message || "Failed to add token");
    }
  };

  // Utility functions
  const formatBalance = (balance: string, decimals = 4): string => {
    const num = parseFloat(balance);
    return num.toFixed(decimals);
  };

  const isValidAddress = (address: string): boolean => {
    return ethers.utils.isAddress(address);
  };

  const getExplorerUrl = (
    txHash: string,
    network = currentNetwork.value
  ): string => {
    if (!network) return "";

    const explorerUrl = NETWORKS[network].blockExplorerUrls[0];
    return `${explorerUrl}/tx/${txHash}`;
  };

  // Watch for account changes
  watch(currentAccount, () => {
    if (currentAccount.value) {
      updateBalance();
    }
  });

  // Initialize on mount
  onMounted(() => {
    checkConnection();
  });

  // Cleanup on unmount
  onUnmounted(() => {
    eventListeners.forEach((listener, event) => {
      if (window.ethereum) {
        window.ethereum.removeListener(event, listener);
      }
    });
    eventListeners.clear();
  });

  return {
    // State
    isConnected: readonly(isConnected),
    currentAccount: readonly(currentAccount),
    currentNetwork: readonly(currentNetwork),
    balance: readonly(balance),
    isConnecting: readonly(isConnecting),
    error: readonly(error),
    provider: readonly(provider),
    signer: readonly(signer),

    // Methods
    connectWallet,
    disconnectWallet,
    switchNetwork,
    sendTransaction,
    signMessage,
    addToken,

    // Utils
    formatBalance,
    isValidAddress,
    getExplorerUrl,
  };
}
```

### 🏦 Задание 15.2: Smart Contract Integration

#### contracts/TokenService.ts

```typescript
import { ethers } from "ethers";
import type {
  TokenContract,
  TokenInfo,
  TokenBalance,
  TokenTransfer,
  AllowanceInfo,
} from "@clh/types";

// ERC-20 ABI
const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
];

export class TokenService {
  private provider: ethers.providers.Provider;
  private signer?: ethers.Signer;

  constructor(provider: ethers.providers.Provider, signer?: ethers.Signer) {
    this.provider = provider;
    this.signer = signer;
  }

  // Get token contract instance
  private getTokenContract(
    address: string,
    withSigner = false
  ): ethers.Contract {
    return new ethers.Contract(
      address,
      ERC20_ABI,
      withSigner && this.signer ? this.signer : this.provider
    );
  }

  // Get token information
  async getTokenInfo(address: string): Promise<TokenInfo> {
    try {
      const contract = this.getTokenContract(address);

      const [name, symbol, decimals, totalSupply] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
        contract.totalSupply(),
      ]);

      return {
        address,
        name,
        symbol,
        decimals,
        totalSupply: totalSupply.toString(),
      };
    } catch (error) {
      throw new Error(`Failed to get token info: ${error.message}`);
    }
  }

  // Get token balance for address
  async getTokenBalance(
    tokenAddress: string,
    userAddress: string
  ): Promise<TokenBalance> {
    try {
      const contract = this.getTokenContract(tokenAddress);
      const balance = await contract.balanceOf(userAddress);
      const decimals = await contract.decimals();

      return {
        tokenAddress,
        userAddress,
        balance: balance.toString(),
        balanceFormatted: ethers.utils.formatUnits(balance, decimals),
        decimals,
      };
    } catch (error) {
      throw new Error(`Failed to get token balance: ${error.message}`);
    }
  }

  // Get multiple token balances
  async getMultipleTokenBalances(
    tokenAddresses: string[],
    userAddress: string
  ): Promise<TokenBalance[]> {
    try {
      const balancePromises = tokenAddresses.map((tokenAddress) =>
        this.getTokenBalance(tokenAddress, userAddress)
      );

      return await Promise.all(balancePromises);
    } catch (error) {
      throw new Error(
        `Failed to get multiple token balances: ${error.message}`
      );
    }
  }

  // Transfer tokens
  async transferToken(
    tokenAddress: string,
    toAddress: string,
    amount: string,
    decimals?: number
  ): Promise<ethers.ContractTransaction> {
    try {
      if (!this.signer) {
        throw new Error("Signer required for transfers");
      }

      const contract = this.getTokenContract(tokenAddress, true);

      // Get decimals if not provided
      if (decimals === undefined) {
        decimals = await contract.decimals();
      }

      const transferAmount = ethers.utils.parseUnits(amount, decimals);

      // Check balance
      const senderAddress = await this.signer.getAddress();
      const balance = await contract.balanceOf(senderAddress);

      if (balance.lt(transferAmount)) {
        throw new Error("Insufficient token balance");
      }

      // Execute transfer
      const tx = await contract.transfer(toAddress, transferAmount);
      return tx;
    } catch (error) {
      throw new Error(`Transfer failed: ${error.message}`);
    }
  }

  // Approve token spending
  async approveToken(
    tokenAddress: string,
    spenderAddress: string,
    amount: string,
    decimals?: number
  ): Promise<ethers.ContractTransaction> {
    try {
      if (!this.signer) {
        throw new Error("Signer required for approvals");
      }

      const contract = this.getTokenContract(tokenAddress, true);

      if (decimals === undefined) {
        decimals = await contract.decimals();
      }

      const approveAmount = ethers.utils.parseUnits(amount, decimals);

      const tx = await contract.approve(spenderAddress, approveAmount);
      return tx;
    } catch (error) {
      throw new Error(`Approval failed: ${error.message}`);
    }
  }

  // Get allowance
  async getAllowance(
    tokenAddress: string,
    ownerAddress: string,
    spenderAddress: string
  ): Promise<AllowanceInfo> {
    try {
      const contract = this.getTokenContract(tokenAddress);
      const allowance = await contract.allowance(ownerAddress, spenderAddress);
      const decimals = await contract.decimals();

      return {
        tokenAddress,
        ownerAddress,
        spenderAddress,
        allowance: allowance.toString(),
        allowanceFormatted: ethers.utils.formatUnits(allowance, decimals),
        decimals,
      };
    } catch (error) {
      throw new Error(`Failed to get allowance: ${error.message}`);
    }
  }

  // Listen to token transfer events
  onTokenTransfer(
    tokenAddress: string,
    callback: (transfer: TokenTransfer) => void,
    filter?: { from?: string; to?: string }
  ): () => void {
    const contract = this.getTokenContract(tokenAddress);

    const transferFilter = contract.filters.Transfer(
      filter?.from || null,
      filter?.to || null
    );

    const listener = (
      from: string,
      to: string,
      value: ethers.BigNumber,
      event: any
    ) => {
      const transfer: TokenTransfer = {
        tokenAddress,
        from,
        to,
        value: value.toString(),
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
        logIndex: event.logIndex,
      };

      callback(transfer);
    };

    contract.on(transferFilter, listener);

    // Return cleanup function
    return () => {
      contract.off(transferFilter, listener);
    };
  }

  // Get token price (using external API)
  async getTokenPrice(tokenAddress: string): Promise<number> {
    try {
      // Example using CoinGecko API
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${tokenAddress}&vs_currencies=usd`
      );

      const data = await response.json();
      return data[tokenAddress.toLowerCase()]?.usd || 0;
    } catch (error) {
      console.warn(`Failed to get token price for ${tokenAddress}:`, error);
      return 0;
    }
  }

  // Batch token operations
  async batchTokenOperations(
    operations: Array<{
      type: "transfer" | "approve";
      tokenAddress: string;
      params: any;
    }>
  ): Promise<ethers.ContractTransaction[]> {
    try {
      if (!this.signer) {
        throw new Error("Signer required for batch operations");
      }

      const transactions = [];

      for (const operation of operations) {
        let tx;

        switch (operation.type) {
          case "transfer":
            tx = await this.transferToken(
              operation.tokenAddress,
              operation.params.to,
              operation.params.amount,
              operation.params.decimals
            );
            break;

          case "approve":
            tx = await this.approveToken(
              operation.tokenAddress,
              operation.params.spender,
              operation.params.amount,
              operation.params.decimals
            );
            break;

          default:
            throw new Error(`Unsupported operation type: ${operation.type}`);
        }

        transactions.push(tx);
      }

      return transactions;
    } catch (error) {
      throw new Error(`Batch operations failed: ${error.message}`);
    }
  }
}

// Composable для использования в компонентах
export function useTokenService() {
  const { provider, signer } = useWeb3();

  const tokenService = computed(() => {
    if (!provider.value) return null;
    return new TokenService(provider.value, signer.value);
  });

  return {
    tokenService: readonly(tokenService),
  };
}
```

### 💱 Задание 15.3: DEX Integration

#### composables/useDEXTrading.ts

```typescript
import { ref, computed } from "vue";
import { ethers } from "ethers";
import type {
  SwapParams,
  SwapQuote,
  DEXProtocol,
  LiquidityPool,
} from "@clh/types";

export interface UseDEXTradingReturn {
  supportedDEXes: ComputedRef<DEXProtocol[]>;
  getSwapQuote: (params: SwapParams) => Promise<SwapQuote>;
  executeSwap: (quote: SwapQuote) => Promise<ethers.ContractTransaction>;
  getLiquidityPools: (
    tokenA: string,
    tokenB: string
  ) => Promise<LiquidityPool[]>;
  addLiquidity: (params: any) => Promise<ethers.ContractTransaction>;
  removeLiquidity: (params: any) => Promise<ethers.ContractTransaction>;
}

// Uniswap V3 Router ABI (simplified)
const UNISWAP_V3_ROUTER_ABI = [
  "function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)",
  "function exactOutputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountOut, uint256 amountInMaximum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountIn)",
];

export function useDEXTrading(): UseDEXTradingReturn {
  const { provider, signer, currentNetwork } = useWeb3();

  // DEX configurations by network
  const DEX_CONFIGS = {
    ethereum: [
      {
        name: "Uniswap V3",
        protocol: "uniswap-v3" as DEXProtocol,
        routerAddress: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
        factoryAddress: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
        fees: [100, 500, 3000, 10000], // 0.01%, 0.05%, 0.3%, 1%
      },
      {
        name: "Uniswap V2",
        protocol: "uniswap-v2" as DEXProtocol,
        routerAddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        factoryAddress: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
        fees: [3000], // 0.3%
      },
    ],
    bsc: [
      {
        name: "PancakeSwap V3",
        protocol: "pancakeswap-v3" as DEXProtocol,
        routerAddress: "0x13f4EA83D0bd40E75C8222255bc855a974568Dd4",
        factoryAddress: "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865",
        fees: [100, 500, 2500, 10000],
      },
    ],
    polygon: [
      {
        name: "QuickSwap",
        protocol: "quickswap" as DEXProtocol,
        routerAddress: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
        factoryAddress: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32",
        fees: [3000],
      },
    ],
  };

  const supportedDEXes = computed(() => {
    if (!currentNetwork.value) return [];
    return DEX_CONFIGS[currentNetwork.value] || [];
  });

  // Get swap quote from multiple DEXes
  const getSwapQuote = async (params: SwapParams): Promise<SwapQuote> => {
    try {
      const quotes = await Promise.allSettled(
        supportedDEXes.value.map((dex) => getQuoteFromDEX(dex, params))
      );

      const validQuotes = quotes
        .filter(
          (result): result is PromiseFulfilledResult<SwapQuote> =>
            result.status === "fulfilled"
        )
        .map((result) => result.value);

      if (validQuotes.length === 0) {
        throw new Error("No valid quotes found");
      }

      // Return best quote (highest output for exact input)
      return validQuotes.reduce((best, current) =>
        ethers.BigNumber.from(current.amountOut).gt(
          ethers.BigNumber.from(best.amountOut)
        )
          ? current
          : best
      );
    } catch (error) {
      throw new Error(`Failed to get swap quote: ${error.message}`);
    }
  };

  // Get quote from specific DEX
  const getQuoteFromDEX = async (
    dex: any,
    params: SwapParams
  ): Promise<SwapQuote> => {
    try {
      // Use 1inch API for aggregated quotes
      const response = await fetch(
        `https://api.1inch.io/v5.0/${getChainId()}/quote?` +
          new URLSearchParams({
            fromTokenAddress: params.tokenIn,
            toTokenAddress: params.tokenOut,
            amount: params.amountIn,
          })
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      return {
        dex: dex.protocol,
        tokenIn: params.tokenIn,
        tokenOut: params.tokenOut,
        amountIn: params.amountIn,
        amountOut: data.toTokenAmount,
        amountOutMin: calculateMinAmountOut(
          data.toTokenAmount,
          params.slippage || 0.5
        ),
        gasEstimate: data.estimatedGas,
        priceImpact: data.priceImpact,
        route: data.protocols?.[0] || [],
        validUntil: Date.now() + 30000, // 30 seconds
      };
    } catch (error) {
      throw new Error(`Quote failed for ${dex.name}: ${error.message}`);
    }
  };

  // Execute swap
  const executeSwap = async (
    quote: SwapQuote
  ): Promise<ethers.ContractTransaction> => {
    try {
      if (!signer.value) {
        throw new Error("Wallet not connected");
      }

      if (Date.now() > quote.validUntil) {
        throw new Error("Quote expired, please refresh");
      }

      const dexConfig = supportedDEXes.value.find(
        (d) => d.protocol === quote.dex
      );
      if (!dexConfig) {
        throw new Error(`DEX configuration not found: ${quote.dex}`);
      }

      // Use 1inch API for swap transaction
      const swapResponse = await fetch(
        `https://api.1inch.io/v5.0/${getChainId()}/swap?` +
          new URLSearchParams({
            fromTokenAddress: quote.tokenIn,
            toTokenAddress: quote.tokenOut,
            amount: quote.amountIn,
            fromAddress: await signer.value.getAddress(),
            slippage: "0.5",
            disableEstimate: "true",
          })
      );

      if (!swapResponse.ok) {
        throw new Error(`Swap API error: ${swapResponse.status}`);
      }

      const swapData = await swapResponse.json();

      // Execute transaction
      const tx = await signer.value.sendTransaction({
        to: swapData.tx.to,
        data: swapData.tx.data,
        value: swapData.tx.value,
        gasLimit: swapData.tx.gas,
        gasPrice: swapData.tx.gasPrice,
      });

      return tx;
    } catch (error) {
      throw new Error(`Swap execution failed: ${error.message}`);
    }
  };

  // Get liquidity pools
  const getLiquidityPools = async (
    tokenA: string,
    tokenB: string
  ): Promise<LiquidityPool[]> => {
    try {
      const pools = await Promise.allSettled(
        supportedDEXes.value.map((dex) => getPoolsFromDEX(dex, tokenA, tokenB))
      );

      return pools
        .filter(
          (result): result is PromiseFulfilledResult<LiquidityPool[]> =>
            result.status === "fulfilled"
        )
        .flatMap((result) => result.value);
    } catch (error) {
      throw new Error(`Failed to get liquidity pools: ${error.message}`);
    }
  };

  const getPoolsFromDEX = async (
    dex: any,
    tokenA: string,
    tokenB: string
  ): Promise<LiquidityPool[]> => {
    // Implementation depends on specific DEX
    // This is a simplified example
    return [];
  };

  // Add liquidity
  const addLiquidity = async (
    params: any
  ): Promise<ethers.ContractTransaction> => {
    // Implementation for adding liquidity
    throw new Error("Add liquidity not implemented");
  };

  // Remove liquidity
  const removeLiquidity = async (
    params: any
  ): Promise<ethers.ContractTransaction> => {
    // Implementation for removing liquidity
    throw new Error("Remove liquidity not implemented");
  };

  // Helper functions
  const getChainId = (): number => {
    const chainIds = {
      ethereum: 1,
      bsc: 56,
      polygon: 137,
      arbitrum: 42161,
    };
    return chainIds[currentNetwork.value] || 1;
  };

  const calculateMinAmountOut = (
    amountOut: string,
    slippage: number
  ): string => {
    const slippageBN = ethers.BigNumber.from(Math.floor(slippage * 100));
    const amountOutBN = ethers.BigNumber.from(amountOut);
    const minAmountOut = amountOutBN.sub(
      amountOutBN.mul(slippageBN).div(10000)
    );
    return minAmountOut.toString();
  };

  return {
    supportedDEXes,
    getSwapQuote,
    executeSwap,
    getLiquidityPools,
    addLiquidity,
    removeLiquidity,
  };
}
```

### 📊 Критерии оценки

#### Задание 15.1: Web3 Provider Integration (50 баллов)

- **Отлично (45-50 баллов):**

  - Поддержка множественных кошельков и сетей
  - Robust error handling и retry логика
  - Persistent сессии и auto-reconnect
  - Comprehensive event handling

- **Хорошо (35-44 балла):**

  - Основные кошельки поддерживаются
  - Базовая обработка ошибок
  - Корректное переключение сетей

- **Удовлетворительно (25-34 балла):**

  - MetaMask подключение работает
  - Простая типизация

- **Неудовлетворительно (0-24 балла):**
  - Подключение не работает
  - Серьезные ошибки в логике

#### Задание 15.2: Smart Contract Integration (50 баллов)

- **Отлично (45-50 баллов):**

  - Полная ERC-20 поддержка
  - Batch operations
  - Event listening
  - Error handling и validation

- **Хорошо (35-44 балла):**

  - Основные токен операции работают
  - Базовая типизация контрактов
  - Простое error handling

- **Удовлетворительно (25-34 балла):**

  - Простые контрактные вызовы
  - Минимальная функциональность

- **Неудовлетворительно (0-24 балла):**
  - Контракты не работают
  - Отсутствует типизация

#### Задание 15.3: DEX Integration (50 баллов)

- **Отлично (45-50 баллов):**

  - Интеграция с множественными DEX
  - Оптимальные маршруты свапов
  - Liquidity operations
  - Price impact расчеты

- **Хорошо (35-44 балла):**

  - Работающие swap операции
  - Базовые quote сравнения
  - Простая интеграция DEX

- **Удовлетворительно (25-34 балла):**

  - Один DEX интегрирован
  - Базовые swap операции

- **Неудовлетворительно (0-24 балла):**
  - DEX интеграция не работает
  - Серьезные проблемы с транзакциями

### 🚀 Дополнительные задачи (бонусы)

1. **Multi-sig wallet support** (+20 баллов)
2. **NFT integration** (+15 баллов)
3. **Cross-chain bridge integration** (+25 баллов)
4. **MEV protection** (+10 баллов)

### 📚 Материалы для изучения

#### Обязательное чтение:

1. **Blockchain & Web3:**

   - "Mastering Ethereum" - Andreas Antonopoulos
   - Ethers.js Documentation
   - Web3.js Documentation

2. **DeFi Protocols:**
   - Uniswap V3 Documentation
   - "How to DeFi" guide series
   - DeFi security best practices

### 🎯 Результат этапа

По завершении этого этапа у вас будет:

- ✅ **Полная Web3 интеграция** с поддержкой множественных кошельков
- ✅ **Smart contract взаимодействие** с типизацией и error handling
- ✅ **DEX trading functionality** с оптимальными маршрутами
- ✅ **Multi-network support** для основных блокчейн сетей
- ✅ **Production-ready blockchain integration** с security best practices
