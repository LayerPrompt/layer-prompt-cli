import { buyTokenTool } from "./buy-token-tool";
import { getBalanceTool } from "./get-balance-tool";
import { getTokenData } from "./get-token-data";
import { getWalletAddressTool } from "./get-wallet-address";
import { readContractTool } from "./read-contract";
import { sellTokenTool } from "./sell-token-tool";
import { sendTransactionTool } from "./send-transaction-tool";

export type ToolConfig<T = any> = {
  definition: {
    type: "function";
    function: {
      name: string;
      description: string;
      parameters: {
        type: "object";
        properties: Record<string, unknown>;
        required: string[];
      };
    };
  };
  handler: (args: T) => Promise<any>;
};

export const tools: Record<string, ToolConfig> = {
  // READ
  get_balance: getBalanceTool,
  get_wallet_address: getWalletAddressTool,
  read_contract: readContractTool,
  get_token_data: getTokenData,

  // WRITE
  send_transaction: sendTransactionTool,
  buy_token: buyTokenTool,
  sell_token: sellTokenTool,
};
