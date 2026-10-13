"use client";

import type { ReactNode } from "react";
import { ChevronRight, Quote } from "lucide-react";
import { useCollectors } from "../hooks/use-collectors";

const contact = (text: string) => `https://wa.me/51937809466?text=${encodeURIComponent(text)}`;

export default function CollectorCommunity({ whatsappIcon }: { whatsappIcon: ReactNode }) {
  const { collectors } = useCollectors();

  return <section className="collector-community" aria-labelledby="collector-community-title" id="coleccionistas">
    <header className="collector-community-heading">
      <h2 id="collector-community-title"><span>Coleccionistas que ya</span><em>confiaron en Waku Waku</em></h2>
      <p>De nuestra tienda a tu vitrina.</p>
    </header>
    <div className="collector-community-mosaic">
      {collectors.map(person => <article className={`collector-story collector-story-${person.slot}`} key={person.id}>
        <img className="collector-story-photo" src={person.image_url} alt={person.alt || `${person.name} con su figura de ${person.figure}`} loading="lazy" decoding="async" width={person.slot === "feature" ? 900 : 1200} height={person.slot === "feature" ? 1200 : 900}/>
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
