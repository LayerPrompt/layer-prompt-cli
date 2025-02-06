import { Address } from "viem";
import { ToolConfig } from "./all-tools.js";
import { createViemWalletClient } from "../viem/create-viem-wallet-client.js";

interface GetWalletAddressArgs {}

export const getWalletAddressTool: ToolConfig<GetWalletAddressArgs> = {
  definition: {
    type: "function",
    function: {
      name: "get_wallet_address",
      description: "Get the connected wallet address",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  handler: async () => {
    return await getWalletAddress();
  },
};

const getWalletAddress = async (): Promise<Address> => {
  const walletClient = createViemWalletClient();
  const [address] = await walletClient.getAddresses();
  return address;
};
