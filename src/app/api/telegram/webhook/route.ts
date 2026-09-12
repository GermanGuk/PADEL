import { webhookCallback } from "grammy";
import { getBot } from "@/lib/telegram/bot";

export const POST = webhookCallback(getBot(), "std/http", {
  secretToken: process.env.TELEGRAM_WEBHOOK_SECRET,
});
