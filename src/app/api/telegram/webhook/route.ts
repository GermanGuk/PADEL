import { webhookCallback } from "grammy";
import { getBot } from "@/lib/telegram/bot";

// Built lazily on the first real request, not at module load time — Next.js
// evaluates route modules while collecting page data during the build, and
// getBot() throws if TELEGRAM_BOT_TOKEN isn't set yet in that environment.
let handler: ((request: Request) => Promise<Response>) | undefined;

export async function POST(request: Request): Promise<Response> {
  if (!handler) {
    handler = webhookCallback(getBot(), "std/http", {
      secretToken: process.env.TELEGRAM_WEBHOOK_SECRET,
    });
  }
  return handler(request);
}
