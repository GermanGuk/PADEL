import "server-only";
import { Bot } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import { addAdmin, isAdmin, listAdmins, removeAdmin } from "./auth";
import { telegramConversationStorage } from "./storage";
import {
  addItemConversation,
  editFieldConversation,
  performDelete,
  showCommunity,
  showDeleteConfirm,
  showItem,
  showList,
  showMainMenu,
  showSettings,
} from "./engine";
import type { MyContext } from "./types";

let botInstance: Bot<MyContext> | undefined;

export function getBot(): Bot<MyContext> {
  if (botInstance) return botInstance;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not set");

  const bot = new Bot<MyContext>(token);

  // Access control — everyone not in telegram_admins is silently ignored.
  bot.use(async (ctx, next) => {
    const id = ctx.from?.id;
    if (!id || !(await isAdmin(id))) return;
    await next();
  });

  bot.use(conversations({ storage: telegramConversationStorage }));
  bot.use(
    createConversation(
      (conversation, ctx, key: string, id: string, fieldKey: string) =>
        editFieldConversation(conversation, ctx, key, id, fieldKey),
      "editField"
    )
  );
  bot.use(
    createConversation((conversation, ctx, key: string) => addItemConversation(conversation, ctx, key), "addItem")
  );

  bot.command("start", async (ctx) => {
    await showMainMenu(ctx);
  });

  bot.command("adduser", async (ctx) => {
    const arg = ctx.match.toString().trim();
    const newId = Number(arg);
    if (!arg || !Number.isFinite(newId)) {
      await ctx.reply("Используйте: /adduser <telegram id>");
      return;
    }
    await addAdmin(newId, undefined);
    await ctx.reply(`✅ Добавлен администратор ${newId}.`);
  });

  bot.command("removeuser", async (ctx) => {
    const arg = ctx.match.toString().trim();
    const delId = Number(arg);
    if (!arg || !Number.isFinite(delId)) {
      await ctx.reply("Используйте: /removeuser <telegram id>");
      return;
    }
    await removeAdmin(delId);
    await ctx.reply(`Удалён администратор ${delId}.`);
  });

  bot.command("users", async (ctx) => {
    const admins = await listAdmins();
    const lines = admins.map((a) => `${a.id}${a.name ? ` — ${a.name}` : ""}`);
    await ctx.reply(lines.length ? lines.join("\n") : "Список пуст.");
  });

  bot.on("callback_query:data", async (ctx) => {
    const data = ctx.callbackQuery.data;
    const [action, key, id, field] = data.split(":");

    if (action === "m") {
      await ctx.answerCallbackQuery();
      await showMainMenu(ctx);
      return;
    }
    if (data === "seo") {
      await ctx.answerCallbackQuery();
      await showSettings(ctx);
      return;
    }
    if (data === "community") {
      await ctx.answerCallbackQuery();
      await showCommunity(ctx);
      return;
    }
    if (action === "l") {
      await ctx.answerCallbackQuery();
      await showList(ctx, key);
      return;
    }
    if (action === "i") {
      await ctx.answerCallbackQuery();
      await showItem(ctx, key, id);
      return;
    }
    if (action === "d") {
      await ctx.answerCallbackQuery();
      await showDeleteConfirm(ctx, key, id);
      return;
    }
    if (action === "dy") {
      await ctx.answerCallbackQuery();
      await performDelete(ctx, key, id);
      return;
    }
    if (action === "a") {
      await ctx.answerCallbackQuery();
      await ctx.conversation.enter("addItem", key);
      return;
    }
    if (action === "e") {
      await ctx.answerCallbackQuery();
      await ctx.conversation.enter("editField", key, id, field);
      return;
    }

    await ctx.answerCallbackQuery();
  });

  botInstance = bot;
  return bot;
}
