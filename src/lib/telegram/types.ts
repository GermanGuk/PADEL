import type { Context } from "grammy";
import type { ConversationFlavor } from "@grammyjs/conversations";

export type MyContext = ConversationFlavor<Context>;

export type SelectOption = { value: string; label: string };

export type FieldSpec =
  | { key: string; label: string; type: "text"; optional?: boolean }
  | { key: string; label: string; type: "number"; optional?: boolean }
  | { key: string; label: string; type: "boolean" }
  | { key: string; label: string; type: "photo"; optional?: boolean; folder: string }
  | { key: string; label: string; type: "select"; optional?: boolean; options: () => Promise<SelectOption[]> };

export type EntityValues = Record<string, string | boolean | null>;

export type EntityItem = { id: string } & Record<string, unknown>;

export type EntityConfig = {
  key: string;
  title: string;
  fields: FieldSpec[];
  list: () => Promise<EntityItem[]>;
  summary: (item: EntityItem) => string;
  detail: (item: EntityItem) => string;
  /** URL of the item's main photo, if it has one — shown above the detail text. */
  photoOf?: (item: EntityItem) => string | null | undefined;
  valuesOf: (item: EntityItem) => EntityValues;
  create: (values: EntityValues) => Promise<void>;
  update: (id: string, values: EntityValues) => Promise<void>;
  remove: (id: string) => Promise<void>;
};
