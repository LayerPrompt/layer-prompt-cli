import OpenAI from "openai";
import { tools } from "../tools/all-tools.js";
import { Assistant } from "openai/resources/beta/assistants";
import { assistantPrompt } from "../const/prompt.js";

export const createAssistant = async (client: OpenAI): Promise<Assistant> => {
  return await client.beta.assistants.create({
    model: "gpt-4o",
    name: "Blinx",
    instructions: assistantPrompt,
    tools: Object.values(tools).map((tool) => tool.definition),
  });
};
