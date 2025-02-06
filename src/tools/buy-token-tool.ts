import { solidityPacked } from "ethers";
import { createViemWalletClient } from "../viem/create-viem-wallet-client.js";
import { ToolConfig } from "./all-tools.js";

const UNISWAP_V3_ROUTER_ADDRESS = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
const UNISWAP_V3_ROUTER_ABI = [
  {
    inputs: [
      { name: "recipient", type: "address" },
      { name: "amountIn", type: "uint256" },
      { name: "amountOutMinimum", type: "uint256" },
      { name: "path", type: "bytes" },
      { name: "deadline", type: "uint256" },
    ],
    name: "exactInput",
    outputs: [{ name: "amountOut", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
] as const;

interface BuyTokenArgs {
  tokenAddress: string;
  amountIn: string;
  amountOutMinimum: string;
  recipient: string;
  deadline: number;
}

export const buyTokenTool: ToolConfig<BuyTokenArgs> = {
  definition: {
    type: "function",
    function: {
      name: "buy_token",
      description: "Buy a token on Ethereum Mainnet using Uniswap V3",
      parameters: {
        type: "object",
        properties: {
          tokenAddress: {
            type: "string",
            description: "Address of the token to buy",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          amountIn: {
            type: "string",
            description: "Amount of ETH to use for the purchase (in wei)",
          },
          amountOutMinimum: {
            type: "string",
            description: "Minimum amount of tokens to receive",
          },
          recipient: {
            type: "string",
            description: "Address to send the purchased tokens to",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          deadline: {
            type: "number",
            description: "Transaction deadline in seconds since epoch",
          },
        },
        required: [
          "tokenAddress",
          "amountIn",
          "amountOutMinimum",
          "recipient",
          "deadline",
        ],
      },
    },
  },
  handler: async (args: {
    tokenAddress: string;
    amountIn: string;
    amountOutMinimum: string;
    recipient: string;
    deadline: number;
  }) => {
    try {
      const walletClient = createViemWalletClient();

      const path = solidityPacked(
        ["address", "address"],
        ["0xC02aaa39b223FE8D0A0E5C4F27eAD9083C756Cc2", args.tokenAddress]
      );

      const hash = await walletClient.writeContract({
        address: UNISWAP_V3_ROUTER_ADDRESS,
        abi: UNISWAP_V3_ROUTER_ABI,
        functionName: "exactInput",
        args: [
          args.recipient as `0x${string}`,
          BigInt(args.amountIn),
          BigInt(args.amountOutMinimum),
          path as `0x${string}`,
          BigInt(args.deadline),
        ],
        value: BigInt(args.amountIn),
      });

      return {
        success: true,
        message: `Transaction successful with TxHash: ${hash}`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Trade failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  },
};
