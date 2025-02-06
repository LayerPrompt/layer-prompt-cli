import { Address } from "viem";
import { ToolConfig } from "./all-tools.js";

interface GetTokenDataArgs {
  address: Address;
}

interface DexScreenerTokenData {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  labels: string[];
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd: string;
  txns: {
    m5: {
      buys: number;
      sells: number;
    };
    h1: {
      buys: number;
      sells: number;
    };
    h6: {
      buys: number;
      sells: number;
    };
    h24: {
      buys: number;
      sells: number;
    };
  };
  volume: {
    h24: number;
    h6: number;
    h1: number;
    m5: number;
  };
  priceChange: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  liquidity: {
    usd: number;
    base: number;
    quote: number;
  };
  fdv: number;
  marketCap: number;
  pairCreatedAt: number;
  info: {
    imageUrl: string;
    header: string;
    openGraph: string;
    websites: {
      label: string;
      url: string;
    }[];
    socials: {
      type: string;
      url: string;
    }[];
  };
  boosts: {
    active: number;
  };
}

export const getTokenData: ToolConfig<GetTokenDataArgs> = {
  definition: {
    type: "function",
    function: {
      name: "get_token_data",
      description:
        "Get token data from DexScreener such as token info, marketcap, price, liquidity, url, etc",
      parameters: {
        type: "object",
        properties: {
          address: {
            type: "string",
            description: "The target token address",
          },
        },
        required: ["address"],
      },
    },
  },
  handler: async ({ address }: GetTokenDataArgs) => {
    return await fetchDexscreener(address);
  },
};

const fetchDexscreener = async (address: Address) => {
  try {
    const chainId = "ethereum";

    const response = await fetch(
      `https://api.dexscreener.com/tokens/v1/${chainId}/${address}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch dexscreener: ${response.statusText}`);
    }

    const data = (await response.json()) as DexScreenerTokenData[];

    if (data.length === 0) {
      return {
        success: true,
        message: `No results found for token: "${address}"`,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: `Failed to get token data: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};
