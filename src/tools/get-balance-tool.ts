import { Address, formatEther } from "viem";
import { ToolConfig } from "./all-tools.js";
import { createViemPublicClient } from "../viem/create-viem-public-client.js";

interface GetBalanceArgs {
  wallet: Address;
}

export const getBalanceTool: ToolConfig<GetBalanceArgs> = {
  definition: {
    type: "function",
    function: {
      name: "get_balance",
      description: "Get the balance of a wallet",
      parameters: {
        type: "object",
        properties: {
          wallet: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
            description: "The wallet address to get the balance of",
          },
        },
        required: ["wallet"],
      },
    },
  },
  handler: async ({ wallet }) => {
    return await getBalance(wallet);
  },
};

const getBalance = async (wallet: Address) => {
  const publicClient = createViemPublicClient();
  const balance = await publicClient.getBalance({ address: wallet });
  return formatEther(balance);
};
