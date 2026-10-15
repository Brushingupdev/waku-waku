import { z } from "zod";

const publicImage = z.string().url().refine(value => /^https?:\/\//i.test(value));
export const siteSettingsSchema = z.object({
  site_name: z.string().min(1),
  logo_url: publicImage.nullable().optional(),
  primary_color: z.string().optional(),
  secondary_color: z.string().optional(),
  contact_email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  texts: z.record(z.string()).default({}),
});
export const siteBannerSchema = z.object({
  id: z.string().min(1), title: z.string().min(1), subtitle: z.string().nullable().optional(),
  image_url: publicImage.nullable(), link_url: z.string().nullable().optional(),
  order: z.number().int(), is_active: z.boolean(),
  placement: z.enum(["carousel", "gallery", "collectors", "footer", "home-promo"]),
});
export type SiteSettings = z.infer<typeof siteSettingsSchema>;
export type SiteBanner = z.infer<typeof siteBannerSchema>;

export function bannerHref(value?: string | null) {
  if (!value) return undefined;
  const path = value.trim();
  if (/^\/(?!\/)/.test(path) && !/[\\\u0000-\u0020]/.test(path)) return path;
  try {
    const url = new URL(path);
    if (["https:", "http:"].includes(url.protocol) && !url.username && !url.password) return url.href;
  } catch { /* A banner without a valid destination remains an image. */ }
  return undefined;
}

export function siteContact(phone?: string | null) {
  const digits = phone?.replace(/[\s()+-]/g, "");
  // Require an international number, including the country code.
  return `https://wa.me/${digits && /^[1-9]\d{9,14}$/.test(digits) ? digits : "51937809466"}`;
}
