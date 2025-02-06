import { buyTokenTool } from "./buy-token-tool.js";
import { getBalanceTool } from "./get-balance-tool.js";
import { getTokenData } from "./get-token-data.js";
import { getWalletAddressTool } from "./get-wallet-address.js";
import { readContractTool } from "./read-contract.js";
import { sellTokenTool } from "./sell-token-tool.js";
import { sendTransactionTool } from "./send-transaction-tool.js";

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
