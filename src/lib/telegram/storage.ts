import "server-only";
import type { ConversationData, VersionedState } from "@grammyjs/conversations";
import { supabaseAdmin } from "@/lib/supabase/admin";

type Versioned = VersionedState<ConversationData>;

// Conversation-state storage for the bot, backed by telegram_sessions.
// Vercel functions don't keep memory between invocations, so the
// conversations plugin's replay state has to live somewhere external.
export const telegramConversationStorage = {
  type: "key" as const,
  adapter: {
    async read(key: string): Promise<Versioned | undefined> {
      const { data } = await supabaseAdmin
        .from("telegram_sessions")
        .select("data")
        .eq("id", Number(key))
        .maybeSingle();
      return data?.data as Versioned | undefined;
    },
    async write(key: string, state: Versioned): Promise<void> {
      await supabaseAdmin
        .from("telegram_sessions")
        .upsert({ id: Number(key), data: state, updated_at: new Date().toISOString() });
    },
    async delete(key: string): Promise<void> {
      await supabaseAdmin.from("telegram_sessions").delete().eq("id", Number(key));
    },
  },
};
