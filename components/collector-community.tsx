import type { ReactNode } from "react";
import { ChevronRight, Quote } from "lucide-react";

// Presentation content for the owner's local preview; replace with approved customer material before publishing.
const collectors = [
  { id: "couple", image: "sofia-diego.webp", name: "Sofía y Diego", city: "Lima", figure: "Hatsune Miku / Trafalgar Law", quote: "Figuras increíbles, llegaron perfectas y ahora son la joya de nuestra colección.", alt: "Sofía y Diego con sus figuras de Hatsune Miku y Trafalgar Law" },
  { id: "bakugo", image: "renzo-bakugo.webp", name: "Renzo", city: "Chiclayo", figure: "Katsuki Bakugo", quote: "La calidad es una locura, superó mis expectativas.", alt: "Figura de Katsuki Bakugo en la colección de Renzo" },
  { id: "gojo", image: "mateo-gojo.webp", name: "Mateo", city: "Arequipa", figure: "Satoru Gojo", quote: "Llegó en perfecto estado y se ve espectacular en mi vitrina.", alt: "Mateo mostrando su figura de Satoru Gojo" },
  { id: "one-piece", image: "carlos-one-piece.webp", name: "Carlos", city: "Piura", figure: "One Piece (colección)", quote: "Poco a poco va quedando completa. Gracias Waku Waku por traer estas joyas.", alt: "Colección de figuras de One Piece de Carlos" },
  { id: "rem", image: "lucia.webp", name: "Lucía", city: "Cusco", figure: "Rem", quote: "Es aún más linda en persona. Ya quiero la de Ram.", alt: "Lucía con su figura de Rem" },
  { id: "unboxing", image: "andres-unboxing.webp", name: "Andrés", city: "Trujillo", figure: "Monkey D. Luffy", quote: "Embalaje de 10, todo llegó muy bien protegido.", alt: "Desembalaje de la figura de Monkey D. Luffy de Andrés" },
];

const contact = (text: string) => `https://wa.me/51937809466?text=${encodeURIComponent(text)}`;

export default function CollectorCommunity({ whatsappIcon }: { whatsappIcon: ReactNode }) {
  return <section className="collector-community" aria-labelledby="collector-community-title" id="coleccionistas">
    <header className="collector-community-heading">
      <h2 id="collector-community-title"><span>Coleccionistas que ya</span><em>confiaron en Waku Waku</em></h2>
      <p>De nuestra tienda a tu vitrina.</p>
    </header>
    <div className="collector-community-mosaic">
      {collectors.map(person => <article className={`collector-story collector-story-${person.id}`} key={person.id}>
        <img className="collector-story-photo" src={`/illustrations/collectors/${person.image}`} alt={person.alt} loading="lazy" decoding="async" width={person.id === "couple" ? 900 : 1200} height={person.id === "couple" ? 1200 : 900}/>
        <div className="collector-story-caption">
          <Quote className="collector-quote-icon" size={32} fill="currentColor" strokeWidth={0} aria-hidden="true"/>
          <div><h3>{person.name}<span> · {person.city}</span></h3><p className="collector-story-figure">{person.figure}</p><blockquote><p>“{person.quote}”</p></blockquote></div>
        </div>
      </article>)}
    </div>
    <footer className="collector-community-footer">
      <div className="collector-community-message"><Quote size={43} fill="currentColor" strokeWidth={0} aria-hidden="true"/><div><blockquote>Cada nueva figura hace<br className="collector-desktop-break"/> más especial mi colección.</blockquote><p>Sofía</p></div></div>
      <a className="collector-community-whatsapp" href={contact("Hola, quiero encontrar mi próxima figura para mi colección. ¿Me ayudan?")} target="_blank" rel="noreferrer">{whatsappIcon}<span>Consultar por WhatsApp</span><ChevronRight size={20} aria-hidden="true"/></a>
      <a className="collector-community-share" href={contact("Hola Waku Waku, quiero compartir una foto de mi colección y mi experiencia con ustedes.")} target="_blank" rel="noreferrer">Compartir mi colección<ChevronRight size={18} aria-hidden="true"/></a>
    </footer>
  </section>;
}
