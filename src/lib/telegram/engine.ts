import "server-only";
import { revalidatePath } from "next/cache";
import { InlineKeyboard, type Context } from "grammy";
import type { Conversation } from "@grammyjs/conversations";
import { saveUploadedBuffer } from "@/lib/upload";
import {
  entities,
  categoryLinks,
  mainMenu,
  settingsFields,
  getSettingsValues,
  saveSettingsValue,
  communityFields,
  getCommunityValues,
  saveCommunityValue,
} from "./entities";
import type { EntityValues, FieldSpec, MyContext } from "./types";

// The homepage is statically cached; bot writes need to bust that cache the
// same way the web admin's server actions already do.
function revalidateSite() {
  revalidatePath("/");
}

// Telegram's sendPhoto needs a real HTTP(S) URL (or a file upload) — it
// rejects the "/images/..." relative paths our seed data and content.ts
// fallbacks use. Uploaded photos are already absolute Supabase Storage
// URLs and pass through unchanged.
function toAbsoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

const SINGLETONS = new Set(["seo", "community"]);

export function mainMenuKeyboard(): InlineKeyboard {
  const kb = new InlineKeyboard();
  for (const item of mainMenu) kb.text(item.label, SINGLETONS.has(item.key) ? item.key : `l:${item.key}`).row();
  return kb;
}

export async function showMainMenu(ctx: Context) {
  await ctx.reply("Админка Top Padel. Выберите раздел:", { reply_markup: mainMenuKeyboard() });
}

export async function showList(ctx: Context, key: string) {
  const entity = entities[key];
  if (!entity) return;
  const items = await entity.list();

  const kb = new InlineKeyboard();
  for (const item of items) kb.text(entity.summary(item), `i:${key}:${item.id}`).row();
  kb.text("➕ Добавить", `a:${key}`).row();
  if (categoryLinks[key]) kb.text("🏷 Категории", `l:${categoryLinks[key]}`).row();
  kb.text("🔙 Меню", "m").row();

  await ctx.reply(`${entity.title} (${items.length}):`, { reply_markup: kb });
}

async function itemKeyboard(key: string, id: string): Promise<InlineKeyboard> {
  const entity = entities[key];
  const kb = new InlineKeyboard();
  for (const field of entity.fields) {
    kb.text(`✏️ ${field.label}`, `e:${key}:${id}:${field.key}`).row();
  }
  kb.text("🗑 Удалить", `d:${key}:${id}`).row();
  kb.text("🔙 Назад", `l:${key}`).row();
  return kb;
}

export async function showItem(ctx: Context, key: string, id: string) {
  const entity = entities[key];
  if (!entity) return;
  const items = await entity.list();
  const item = items.find((i) => i.id === id);
  if (!item) {
    await ctx.reply("Не найдено — возможно, уже удалено.");
    await showList(ctx, key);
    return;
  }

  const kb = await itemKeyboard(key, id);
  const text = entity.detail(item) || entity.summary(item);
  const photo = entity.photoOf?.(item);

  if (photo) {
    await ctx.replyWithPhoto(toAbsoluteUrl(photo), { caption: text, reply_markup: kb });
  } else {
    await ctx.reply(text, { reply_markup: kb });
  }
}

export async function showDeleteConfirm(ctx: Context, key: string, id: string) {
  const kb = new InlineKeyboard()
    .text("Да, удалить", `dy:${key}:${id}`)
    .text("Отмена", `i:${key}:${id}`);
  await ctx.reply("Точно удалить?", { reply_markup: kb });
}

export async function performDelete(ctx: Context, key: string, id: string) {
  const entity = entities[key];
  if (!entity) return;
  await entity.remove(id);
  revalidateSite();
  await ctx.reply("🗑 Удалено.");
  await showList(ctx, key);
}

// ── SEO (singleton, no list) ────────────────────────────────────────
export async function showSettings(ctx: Context) {
  const values = await getSettingsValues();
  const kb = new InlineKeyboard();
  for (const field of settingsFields) kb.text(`✏️ ${field.label}`, `e:seo:_:${field.key}`).row();
  kb.text("🔙 Меню", "m").row();

  const lines = [
    `Title: ${values.seoTitle}`,
    `Description: ${values.seoDescription || "—"}`,
    `Telegram: ${values.telegramUrl || "—"}`,
    `Instagram: ${values.instagramUrl || "—"}`,
    `WhatsApp: ${values.whatsappUrl || "—"}`,
  ];
  if (values.faviconUrl) {
    await ctx.replyWithPhoto(toAbsoluteUrl(String(values.faviconUrl)), {
      caption: lines.join("\n"),
      reply_markup: kb,
    });
  } else {
    await ctx.reply(lines.join("\n"), { reply_markup: kb });
  }
}

// ── Сообщество (singleton, no list) ──────────────────────────────────
export async function showCommunity(ctx: Context) {
  const values = await getCommunityValues();
  const kb = new InlineKeyboard();
  for (const field of communityFields) kb.text(`✏️ ${field.label}`, `e:community:_:${field.key}`).row();
  kb.text("🔙 Меню", "m").row();

  const caption = [
    `${values.heading} ${values.headingHighlight}`,
    String(values.description ?? ""),
    `Кнопка: ${values.buttonLink}`,
  ].join("\n");

  if (values.image) {
    await ctx.replyWithPhoto(toAbsoluteUrl(String(values.image)), { caption, reply_markup: kb });
  } else {
    await ctx.reply(caption, { reply_markup: kb });
  }
}

// ── Field prompting, shared by "add" and "edit one field" ───────────
async function promptField(
  conversation: Conversation<MyContext>,
  ctx: Context,
  field: FieldSpec,
  current: string | boolean | null | undefined
): Promise<string | boolean | null> {
  if (field.type === "boolean") {
    const kb = new InlineKeyboard().text("Да", "v:yes").text("Нет", "v:no");
    await ctx.reply(`${field.label}?`, { reply_markup: kb });
    const cbCtx = await conversation.waitForCallbackQuery(["v:yes", "v:no"]);
    await cbCtx.answerCallbackQuery().catch(() => {});
    return cbCtx.callbackQuery.data === "v:yes";
  }

  if (field.type === "select") {
    const options = await conversation.external(() => field.options());
    const kb = new InlineKeyboard();
    if (field.optional) kb.text("— без категории —", "v:__none__").row();
    for (const opt of options) kb.text(opt.label, `v:${opt.value}`).row();
    if (options.length === 0 && !field.optional) {
      await ctx.reply(`Нет доступных вариантов для «${field.label}» — сначала создайте хотя бы одну категорию.`);
      return null;
    }
    await ctx.reply(`${field.label}:`, { reply_markup: kb });
    const cbCtx = await conversation.waitFor("callback_query:data");
    await cbCtx.answerCallbackQuery().catch(() => {});
    const val = cbCtx.callbackQuery.data.slice(2);
    return val === "__none__" ? null : val;
  }

  if (field.type === "photo") {
    while (true) {
      await ctx.reply(
        `${field.label} — пришлите фото${field.optional ? " (или «-» чтобы оставить как есть/пропустить)" : ""}:`
      );
      const msgCtx = await conversation.waitFor(["message:photo", "message:text"]);
      if (msgCtx.message.text === "-") return current === undefined ? null : (current as string | null);

      const photo = msgCtx.message.photo;
      if (!photo || photo.length === 0) {
        await ctx.reply("Это не похоже на фото — пришлите именно изображение.");
        continue;
      }
      const largest = photo[photo.length - 1];
      const file = await ctx.api.getFile(largest.file_id);
      const token = process.env.TELEGRAM_BOT_TOKEN;
      const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;

      const uploadedUrl = await conversation.external(async () => {
        const res = await fetch(fileUrl);
        const bytes = Buffer.from(await res.arrayBuffer());
        return saveUploadedBuffer(bytes, "photo.jpg", "image/jpeg", field.folder);
      });
      return uploadedUrl;
    }
  }

  // text / number
  await ctx.reply(
    `${field.label}${current ? ` (сейчас: ${current})` : ""}${field.optional ? " — можно «-» чтобы очистить" : ""}:`
  );
  const msgCtx = await conversation.waitFor("message:text");
  const text = msgCtx.message.text.trim();
  if (text === "-") return null;
  return text;
}

export async function editFieldConversation(
  conversation: Conversation<MyContext>,
  ctx: Context,
  key: string,
  id: string,
  fieldKey: string
) {
  if (key === "seo") {
    const field = settingsFields.find((f) => f.key === fieldKey);
    if (!field) return;
    const values = await conversation.external(() => getSettingsValues());
    const newValue = await promptField(conversation, ctx, field, values[fieldKey]);
    await conversation.external(async () => {
      await saveSettingsValue(fieldKey, newValue);
      revalidateSite();
    });
    await ctx.reply("✅ Сохранено.");
    await showSettings(ctx);
    return;
  }

  if (key === "community") {
    const field = communityFields.find((f) => f.key === fieldKey);
    if (!field) return;
    const values = await conversation.external(() => getCommunityValues());
    const newValue = await promptField(conversation, ctx, field, values[fieldKey]);
    await conversation.external(async () => {
      await saveCommunityValue(fieldKey, newValue);
      revalidateSite();
    });
    await ctx.reply("✅ Сохранено.");
    await showCommunity(ctx);
    return;
  }

  const entity = entities[key];
  if (!entity) return;
  const field = entity.fields.find((f) => f.key === fieldKey);
  if (!field) return;

  const items = await conversation.external(() => entity.list());
  const item = items.find((i) => i.id === id);
  if (!item) {
    await ctx.reply("Не найдено — возможно, уже удалено.");
    return;
  }

  const values = entity.valuesOf(item);
  const newValue = await promptField(conversation, ctx, field, values[fieldKey]);
  values[fieldKey] = newValue;
  await conversation.external(async () => {
    await entity.update(id, values);
    revalidateSite();
  });
  await ctx.reply("✅ Сохранено.");
  await showItem(ctx, key, id);
}

export async function addItemConversation(conversation: Conversation<MyContext>, ctx: Context, key: string) {
  const entity = entities[key];
  if (!entity) return;

  const values: EntityValues = {};
  for (const field of entity.fields) {
    if (field.type === "boolean" && field.key === "featured") {
      values[field.key] = false; // skip asking on create, default off
      continue;
    }
    values[field.key] = await promptField(conversation, ctx, field, undefined);
  }

  await conversation.external(async () => {
    await entity.create(values);
    revalidateSite();
  });
  await ctx.reply("✅ Добавлено.");
  await showList(ctx, key);
}
