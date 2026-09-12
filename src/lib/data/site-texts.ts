import { siteTexts, type SiteTexts } from "@/lib/content";

// Copy blocks (Hero/Training/Community headlines) are not part of the admin
// scope for this phase — always served from the static defaults.
export async function getSiteTexts(): Promise<SiteTexts> {
  return siteTexts;
}
