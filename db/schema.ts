import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const productEdits = sqliteTable("product_edits", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  detail: text("detail").notNull().default(""),
  series: text("series").notNull().default(""),
  price: integer("price"),
  status: text("status").notNull().default("por_confirmar"),
  quantity: integer("quantity"),
  month: text("month").notNull().default(""),
  image: text("image").notNull().default(""),
  source: text("source").notNull().default(""),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
  updatedAt: text("updated_at").notNull(),
});
