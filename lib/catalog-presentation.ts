import type { Product } from "./product-model";
import { usesReferenceArtwork, usesReferencePoster } from "./reference-artwork";
import { approvedCommerceMedia } from "./commerce-media";

// Existing artwork and editorial ordering. Product data comes from products-api.
export const featuredIds = [
  "DaoZfSFn3XY-1", "Da6q6QukYcK-2", "DQ2tT3EEQoO-1", "DVKO171kQPy-1",
  "DU6btvSARSm-1", "DaELkMLHwJw-1", "DaGveDbnxoS-1", "DU1S9PjgWPy-2",
];
export const showcaseArt: Record<string, { image: string; accent: string }> = {
  "DaoZfSFn3XY-1": { image: "/illustrations/carousel-manga/toga.webp", accent: "#ff80ac" },
  "Da6q6QukYcK-2": { image: "/illustrations/carousel-manga/bakugo.webp", accent: "#ff9858" },
  "DQ2tT3EEQoO-1": { image: "/illustrations/carousel-manga/miku.webp", accent: "#73e1df" },
  "DVKO171kQPy-1": { image: "/illustrations/carousel-manga/law.webp", accent: "#ffc46d" },
  "DU6btvSARSm-1": { image: "/illustrations/carousel-manga/gojo.webp", accent: "#c4a7ff" },
  "DaELkMLHwJw-1": { image: "/illustrations/carousel-manga/killua.webp", accent: "#89c5ff" },
  "DaGveDbnxoS-1": { image: "/illustrations/carousel-manga/douma.webp", accent: "#ff808e" },
  "DU1S9PjgWPy-2": { image: "/illustrations/carousel-manga/rem.webp", accent: "#8cd7ff" },
};
export const sideCaptionArtwork: Record<string, { file: string; price: number }> = {
  "DQ2tT3EEQoO-1": { file: "miku", price: 75 },
  "DU6btvSARSm-1": { file: "gojo", price: 80 },
  "DVKO171kQPy-1": { file: "law", price: 160 },
  "DaoZfSFn3XY-1": { file: "toga", price: 380 },
  "Da6q6QukYcK-2": { file: "bakugo", price: 150 },
  "DaELkMLHwJw-1": { file: "killua", price: 75 },
  "DaGveDbnxoS-1": { file: "douma", price: 90 },
  "DU1S9PjgWPy-2": { file: "rem", price: 120 },
};
export const sideCaptionImage = (product: Product) => {
  const artwork = sideCaptionArtwork[product.referenceId || product.id];
  if (!usesReferenceArtwork(product) || artwork?.price !== product.price) return undefined;
  return approvedCommerceMedia(product)?.presentation.lettering || `/illustrations/carousel-lettering/${artwork.file}.png`;
};

export function showcaseImage(product: Product, center: boolean) {
  if (center && !usesReferencePoster(product)) return product.image;
  const approved = usesReferenceArtwork(product) ? approvedCommerceMedia(product) : undefined;
  const cloudImage = approved?.presentation[center ? "hero" : "side"];
  if (cloudImage) return cloudImage;
  const image = usesReferenceArtwork(product) ? showcaseArt[product.referenceId || product.id]?.image : undefined;
  return (center ? image?.replace("/carousel-manga/", "/carousel-energy/").replace(".webp", ".png") : image) || product.image;
}
export const modalMangaArtwork = (title:string) => title.includes("Bakugo") ? "bakugo" : title.includes("Toga") ? "toga" : title.includes("Miku") ? "miku" : title.includes("Law") ? "law" : title.includes("Gojo") ? "gojo" : title.includes("Killua") ? "killua" : title.includes("Douma") ? "douma" : title === "Rem" ? "rem" : null;
export const mainSeries = ["My Hero Academia", "Vocaloid", "One Piece", "Re:Zero"];
export const sidebarSeries = ["My Hero Academia", "Kimetsu no Yaiba", "One Piece", "Vocaloid", "Re:Zero", "Jujutsu Kaisen", "Hunter x Hunter", "Bleach", "Evangelion", "My Dress-Up Darling"];
export const seriesImages: Record<string, string> = {
  "Kimetsu no Yaiba": "anime-logos/series-0.webp",
  "Jujutsu Kaisen": "anime-logos/series-1.webp",
  "Hunter x Hunter": "anime-logos/series-2.webp",
  "Bleach": "anime-logos/series-3.webp",
  "Evangelion": "anime-logos/series-4.webp",
  "My Dress-Up Darling": "anime-logos/series-5.webp",
  "Attack on Titan": "anime-logos/series-6.webp",
  "Bunny Girl Senpai": "anime-logos/series-7.webp",
  "Haikyu!!": "anime-logos/series-10.webp",
  "Dandadan": "anime-logos/series-8.webp",
  "Date A Live": "anime-logos/series-9.webp",
  "Tokyo Ghoul": "anime-logos/series-11.webp",
  "Yu-Gi-Oh!": "anime-logos/series-12.webp",
  "My Hero Academia": "series-my-hero.png",
  "Vocaloid": "series-vocaloid.png",
  "One Piece": "series-one-piece.png",
  "Re:Zero": "series-re-zero.png",
};
export const animeFilterLogos: Record<string,string> = {
  "My Hero Academia": "/illustrations/bilingual-logos/hero.webp",
  "Kimetsu no Yaiba": "/illustrations/bilingual-logos/demon.webp",
  "One Piece": "/illustrations/bilingual-logos/piece.webp",
  "Vocaloid": "/illustrations/bilingual-logos/miku.webp",
  "Re:Zero": "/illustrations/bilingual-logos/rezero.webp",
  "Jujutsu Kaisen": "/illustrations/bilingual-logos/jujutsu.webp",
  "Hunter x Hunter": "/illustrations/bilingual-logos/hunter.webp",
  "Bleach": "/illustrations/bilingual-logos/bleach.webp",
  "Evangelion": "/illustrations/bilingual-logos/eva.webp",
  "My Dress-Up Darling": "/illustrations/bilingual-logos/dress.webp",
  "Attack on Titan": "/illustrations/bilingual-logos/titan.webp",
  "Bunny Girl Senpai": "/illustrations/bilingual-logos/bunny.webp",
  "Dandadan": "/illustrations/bilingual-logos/dandadan.webp",
  "Date A Live": "/illustrations/bilingual-logos/date.webp",
  "Haikyu!!": "/illustrations/bilingual-logos/haikyu.webp",
  "Tokyo Ghoul": "/illustrations/bilingual-logos/ghoul.webp",
  "Yu-Gi-Oh!": "/illustrations/bilingual-logos/yugi.webp"
};
export const photoCrops: Record<string, [string, string]> = {
  "pdf-5-miku-fashion": ["420%", "43% 17%"],
  "pdf-5-snow-miku": ["350%", "40% 72%"],
  "pdf-5-miku-figurizm": ["420%", "66% 69%"],
  "pdf-6-rem-bicute": ["400%", "46% 22%"],
  "pdf-6-ram-bicute": ["400%", "66% 78%"],
  "pdf-7-tamaki-set": ["200%", "50% 40%"],
};
export const focalPositions: Record<string, string> = {
  "Da6q6QukYcK-1": "50% 10%", "Da6q6QukYcK-2": "50% 3%",
  "DaoZfSFn3XY-1": "50% 23%", "DaoZfSFn3XY-2": "50% 8%",
  "DQ2tT3EEQoO-1": "50% 16%", "DPev6RhEaCe-1": "50% 16%",
  "DU1S9PjgWPy-2": "50% 11%",
};

export const seriesSpotlights: Record<string, { id: string; image: string }> = {
  "My Hero Academia": { id:"Da6q6QukYcK-2", image:"/illustrations/series-showcase/bakugo.webp" },
  "Vocaloid": { id:"DQ2tT3EEQoO-1", image:"/illustrations/series-showcase/miku.webp" },
  "One Piece": { id:"DVKO171kQPy-1", image:"/illustrations/series-showcase/law.webp" },
  "Re:Zero": { id:"DU1S9PjgWPy-2", image:"/illustrations/series-showcase/rem.webp" },
};
export const collectionPhotos: Record<string,string> = {
  "pdf-5-miku-fashion":"miku-fashion", "pdf-5-snow-miku":"snow-miku", "pdf-5-miku-figurizm":"miku-figurizm",
  "pdf-6-rem-bicute":"rem-bicute", "pdf-6-ram-bicute":"ram-bicute",
};
export const illustratedCollectionPhotos:Record<string,string> = {
  "pdf-7-tamaki-set": "/illustrations/equal-gallery/tamaki-set-clean.png",
  "rezero-emilia": "/illustrations/equal-gallery/emilia.png",
  "Da6q6QukYcK-1": "/illustrations/equal-gallery/bakugo-back.webp",
  "DaoZfSFn3XY-1": "/illustrations/equal-gallery/toga-uraraka.webp",
  "DaoZfSFn3XY-2": "/illustrations/equal-gallery/deku.webp",
  "DPnDHfPDUXh-1": "/illustrations/equal-gallery/bakugo-small.webp",
  "DPnDHfPDUXh-2": "/illustrations/equal-gallery/toga.webp",
  "pdf-5-snow-miku": "/illustrations/equal-gallery/snow.webp",
  "pdf-5-miku-fashion": "/illustrations/equal-gallery/fashion.webp",
  "pdf-5-miku-figurizm": "/illustrations/equal-gallery/figurizm.webp",
  "DVKO171kQPy-2": "/illustrations/equal-gallery/lilith.webp",
  "DPev6RhEaCe-1": "/illustrations/equal-gallery/mihawk.webp",
  "DPev6RhEaCe-2": "/illustrations/equal-gallery/roger.webp",
  "pdf-6-rem-bicute": "/illustrations/equal-gallery/rem-selected.webp",
  "pdf-6-ram-bicute": "/illustrations/equal-gallery/ram-selected.webp",
  "Da6q6QukYcK-2": "/illustrations/equal-gallery/bakugo.webp",
  "DQ2tT3EEQoO-1": "/illustrations/equal-gallery/miku.webp",
  "DVKO171kQPy-1": "/illustrations/equal-gallery/law.webp",
  "DU1S9PjgWPy-2": "/illustrations/equal-gallery/rem-portrait.png"
};
