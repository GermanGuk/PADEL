import "server-only";
import { supabasePublic } from "@/lib/supabase/public";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { DbCommunityContent } from "@/lib/db-types";

const FALLBACK: DbCommunityContent = {
  heading: "Ищешь напарника?",
  headingHighlight: "Найдём.",
  description: "В Telegram каждый день ищут игроков, собирают пары, договариваются об играх и турнирах.",
  buttonLink: "#",
  image: "/images/community/photo.png",
};

type Row = {
  heading: string;
  heading_highlight: string;
  description: string;
  button_link: string;
  image: string;
};

function fromRow(row: Row): DbCommunityContent {
  return {
    heading: row.heading,
    headingHighlight: row.heading_highlight,
    description: row.description,
    buttonLink: row.button_link,
    image: row.image,
  };
}

export async function getCommunityContent(): Promise<DbCommunityContent> {
  const { data, error } = await supabasePublic.from("community_content").select("*").eq("id", 1).maybeSingle();
  if (error || !data) return FALLBACK;
  return fromRow(data as Row);
}

export async function getCommunityContentForAdmin(): Promise<DbCommunityContent> {
  const { data, error } = await supabaseAdmin.from("community_content").select("*").eq("id", 1).maybeSingle();
  if (error || !data) return FALLBACK;
  return fromRow(data as Row);
}

export async function updateCommunityContent(data: DbCommunityContent): Promise<void> {
  const { error } = await supabaseAdmin.from("community_content").upsert({
    id: 1,
    heading: data.heading,
    heading_highlight: data.headingHighlight,
    description: data.description,
    button_link: data.buttonLink,
    image: data.image,
  });
  if (error) throw new Error(`Failed to update community content: ${error.message}`);
}
