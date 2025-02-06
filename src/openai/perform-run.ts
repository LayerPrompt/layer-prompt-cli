import OpenAI from "openai";
import { Run } from "openai/resources/beta/threads";
import { Thread } from "openai/src/resources/beta";
import { runToolsHandler } from "./tools-handler.js";

export const performRun = async (run: Run, client: OpenAI, thread: Thread) => {
  while (run.status === "requires_action") {
    run = await runToolsHandler(run, client, thread);
  }

  if (run.status === "failed") {
    const errMsg = `I encountered an error: ${
      run.last_error?.message || "Unknown error"
    }`;

    console.error("Run failed: ", run.last_error);

    await client.beta.threads.messages.create(thread.id, {
      role: "assistant",
      content: errMsg,
    });

    return {
      type: "text",
      text: {
        value: errMsg,
        annotations: [],
      },
    };
  }

  const messages = await client.beta.threads.messages.list(thread.id);

  const assistantMsg = messages.data.find((msg) => msg.role === "assistant");

  return (
    assistantMsg?.content[0] || {
      type: "text",
      text: { value: "No response from assistant", annotations: [] },
    }
  );
};
