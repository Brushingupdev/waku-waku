import type { Product } from "../lib/product-model";

function ig(id: string, slide: 1 | 2, title: string, detail: string, series: string, price: number, month = ""): Product {
  const folder = slide === 1 ? "portadas" : "diapositivas_02";
  const extension = id === "DU1S9PjgWPy" ? "jpg" : "webp";
  return {
    id: `${id}-${slide}`,
    title,
    detail,
    series,
    price,
    status: "por_confirmar",
    quantity: null,
    month,
    image: `/catalogo/instagram/${folder}/${id}.${extension}`,
    source: `https://www.instagram.com/wakuwaku.pe/p/${id}/`,
    visible: true,
  };
}

function pdf(page: number, key: string, title: string, detail: string, series: string, price: number): Product {
  return {
    id: `pdf-${page}-${key}`,
    title,
    detail,
    series,
    price,
    status: "por_confirmar",
    quantity: null,
    month: "Setiembre 2026",
    image: `/catalogo/pdf/pagina-${String(page).padStart(2, "0")}.jpg`,
    source: `PDF página ${page}`,
    visible: true,
  };
}

export const baseProducts: Product[] = [
  ig("Da6q6QukYcK", 1, "Katsuki Bakugo", "Ichiban Kuji · Premio B · 23 cm", "My Hero Academia", 180, "Setiembre 2026"),
  ig("Da6q6QukYcK", 2, "Katsuki Bakugo", "Ichiban Kuji · Premio B · 25 cm", "My Hero Academia", 150, "Setiembre 2026"),
  ig("DaoZfSFn3XY", 1, "Toga vs Uraraka", "Ichiban Kuji · Last One · 18 cm", "My Hero Academia", 380, "Setiembre 2026"),
  ig("DaoZfSFn3XY", 2, "Izuku Midoriya", "Ichiban Kuji · Premio A · 22 cm", "My Hero Academia", 240, "Setiembre 2026"),
  ig("DaGveDbnxoS", 1, "Douma", "Banpresto Grandista · 25 cm", "Kimetsu no Yaiba", 90),
  ig("DaGveDbnxoS", 2, "Akaza", "Banpresto Grandista · 23 cm", "Kimetsu no Yaiba", 80),
  ig("DaELkMLHwJw", 1, "Killua Zoldyck", "Banpresto Grandista · 25 cm", "Hunter x Hunter", 75),
  ig("DaELkMLHwJw", 2, "Kurapika", "Banpresto Grandista · 27 cm", "Hunter x Hunter", 75),
  ig("DVKO171kQPy", 1, "Trafalgar Law", "Ichiban Kuji · 25 cm", "One Piece", 160),
  ig("DVKO171kQPy", 2, "Lilith", "Ichiban Kuji · 20 cm", "One Piece", 120),
  ig("DU9c6vZkTtV", 1, "Ichigo", "Banpresto Grandista · 32 cm", "Bleach", 80, "Marzo 2026"),
  ig("DU9c6vZkTtV", 2, "Eren", "Banpresto Grandista · 28 cm", "Attack on Titan", 90, "Marzo 2026"),
  ig("DU6btvSARSm", 1, "Satoru Gojo", "SEGA Figurizmα · 36 cm", "Jujutsu Kaisen", 80, "Abril 2026"),
  ig("DU6btvSARSm", 2, "Choso", "SEGA Figurizmα · 22 cm", "Jujutsu Kaisen", 80, "Abril 2026"),
  ig("DU1S9PjgWPy", 1, "Tohka", "Taito AMP+ · 23 cm", "Date A Live", 120, "Mayo 2026"),
  ig("DU1S9PjgWPy", 2, "Rem", "Taito AMP+ · 28 cm", "Re:Zero", 120, "Mayo 2026"),
  ig("DQ2tT3EEQoO", 1, "Hatsune Miku", "Taito AMP+ · 21 cm", "Vocaloid", 75, "Enero 2026"),
  ig("DQ2tT3EEQoO", 2, "Mai Sakurajima", "Taito AMP+ · 15 cm", "Bunny Girl Senpai", 65, "Enero 2026"),
  ig("DQxWOj2AVBB", 1, "Marin Kitagawa", "Banpresto Espresto · 26 cm", "My Dress-Up Darling", 70, "Enero 2026"),
  ig("DQxWOj2AVBB", 2, "Marin Kitagawa", "GiGO Vivit · 27 cm", "My Dress-Up Darling", 75, "Enero 2026"),
  ig("DQFTyVFAZa9", 1, "Ken Kaneki", "Banpresto Grandista · 27 cm", "Tokyo Ghoul", 100, "Enero 2026"),
  ig("DQFTyVFAZa9", 2, "Okarun v2", "SEGA Luminasta · 21 cm", "Dandadan", 75, "Enero 2026"),
  ig("DPxTaE5kWC3", 1, "Ra", "Konami Monsters Legion · 26 cm", "Yu-Gi-Oh!", 85),
  ig("DPxTaE5kWC3", 2, "Obelisco", "Konami Monsters Legion · 21 cm", "Yu-Gi-Oh!", 85),
  ig("DPnDHfPDUXh", 1, "Bakugo", "Ichiban Kuji · 17 cm", "My Hero Academia", 120),
  ig("DPnDHfPDUXh", 2, "Toga", "Ichiban Kuji · 21 cm", "My Hero Academia", 160),
  ig("DPev6RhEaCe", 1, "Mihawk", "Ichiban Kuji · 16 cm", "One Piece", 180),
  ig("DPev6RhEaCe", 2, "Gol D. Roger", "Ichiban Kuji · 21 cm", "One Piece", 160),
  pdf(5, "miku-fashion", "Hatsune Miku", "Fashion Outdoor · Taito", "Vocaloid", 70),
  pdf(5, "snow-miku", "Snow Miku", "Third Season · Ichiban Kuji", "Vocaloid", 200),
  pdf(5, "miku-figurizm", "Hatsune Miku", "Figurizmα · SEGA", "Vocaloid", 75),
  pdf(6, "rem-bicute", "Rem", "BiCute Bunnies", "Re:Zero", 75),
  pdf(6, "asuka-spm", "Asuka", "SPM · SEGA", "Evangelion", 70),
  pdf(6, "eva01", "Evangelion Unidad 01", "Ichiban Kuji · Mega Impact", "Evangelion", 240),
  pdf(6, "ram-bicute", "Ram", "BiCute Bunnies", "Re:Zero", 75),
  pdf(7, "tamaki-set", "Tamaki Amajiki", "Set de cumpleaños", "My Hero Academia", 70),
  pdf(8, "kenma-badge", "Kenma Kozume", "Insignia de cumpleaños", "Haikyu!!", 30),
  { id: "rezero-emilia", title: "Emilia", detail: "Ilustración de referencia · Precio por confirmar", series: "Re:Zero", price: null, status: "por_confirmar", quantity: null, month: "", image: "/illustrations/equal-gallery/emilia.png", source: "Ilustración generada", visible: true },
];

