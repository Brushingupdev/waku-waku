import Link from "next/link";
import { ArrowRight, ChevronDown, CircleHelp } from "lucide-react";
import StorefrontShell from "../../components/storefront-shell";
import { WhatsAppIcon } from "../../components/whatsapp-icon";

const contact = `https://wa.me/51937809466?text=${encodeURIComponent("Hola, me interesa una figura de Waku Waku. ¿Me ayudan a confirmar el precio, la disponibilidad y cómo hacer mi pedido?")}`;
const art = "/illustrations/how-to-buy";
const steps = [
  { number: "01", title: "Elige tu figura", description: "Explora el catálogo, busca tu anime favorito y abre la figura que te interese.", image: "choose.png", alt: "Figura de Luffy junto a un catálogo de figuras en una tablet", href: "/", action: "Explorar catálogo" },
  { number: "02", title: "Escríbenos por WhatsApp", description: "Envíanos el nombre o enlace de la figura y pregunta por el precio y la disponibilidad actual.", image: "chat.png", alt: "Teléfono con un mensaje consultando el precio y la disponibilidad de Katsuki Bakugo", href: contact, action: "Consultar una figura por WhatsApp" },
  { number: "03", title: "Coordina tu pedido", description: "Por WhatsApp confirmaremos las opciones de separación, pago y entrega.", image: "package.png", alt: "Caja de envío con una figura protegida e ilustraciones de conversación, pago y entrega", href: contact, action: "Coordinar mi pedido por WhatsApp" },
];

const faqs = [
  { question: "¿Cómo hago mi pedido?", answer: "Elige una figura del catálogo o de preventas y envíanos su nombre o enlace por WhatsApp. Te confirmaremos el precio, la disponibilidad y los pasos para comprarla." },
  { question: "¿Cómo confirmo el precio y la disponibilidad?", answer: "Consúltanos por WhatsApp antes de separar tu figura. Así podrás confirmar el precio actual y si la unidad que te interesa sigue disponible." },
  { question: "¿Cómo compro una figura en preventa?", answer: "Entra a Preventas, elige el mes y revisa las páginas del catálogo. Envíanos la figura que te interesa para consultar su disponibilidad, las condiciones de separación y la fecha estimada de llegada." },
  { question: "¿Qué significa que una figura esté “separada”?", answer: "Esa unidad ya está reservada. Escríbenos para consultar si hay otra disponible o si podemos informarte sobre una próxima llegada." },
  { question: "¿Cómo puedo pagar o separar mi figura?", answer: "Al consultar tu pedido por WhatsApp, te indicaremos los medios de pago disponibles y las condiciones para separarlo. Confirma esos detalles antes de realizar un pago." },
  { question: "¿Cómo coordino la entrega de mi pedido?", answer: "Indícanos tu ciudad o distrito por WhatsApp para revisar las opciones de entrega, el costo y el plazo de tu pedido antes de confirmar la compra." },
];
export default function ComoComprarPage() {
  return <StorefrontShell active="comprar"><main className="buy-guide">
    <section className="buy-guide-hero" aria-labelledby="buy-guide-title">
      <div className="buy-guide-hero-copy"><h1 id="buy-guide-title">Tu próxima figura,<span>a un mensaje<br/>de distancia</span></h1><p>Explora el catálogo, cuéntanos qué figura te interesa por WhatsApp y coordina tu pedido directamente con nosotros. Así de fácil.</p><a className="buy-guide-contact" href={contact} target="_blank" rel="noreferrer"><WhatsAppIcon/><span>Consultar por WhatsApp</span><ArrowRight size={20} aria-hidden="true"/></a><Link prefetch={false} className="buy-guide-catalog" href="/">Explorar catálogo<ArrowRight size={18} aria-hidden="true"/></Link></div>
      <img className="buy-guide-hero-art" src={`${art}/hero.png`} alt="Asistente Waku Waku con un teléfono y una figura, acompañada de Miku y Bakugo" width={1600} height={1100}/>
    </section>
    <section className="buy-guide-steps" aria-labelledby="buy-guide-steps-title"><header><p className="buy-guide-eyebrow">ASÍ DE SIMPLE</p><h2 id="buy-guide-steps-title">Cómo comprar en <span>Waku Waku</span></h2><p>Sigue estos 3 pasos y coordina tu figura directamente por WhatsApp.</p></header><ol>{steps.map(step=><li key={step.number}><div className="buy-guide-step-copy"><span className="buy-guide-step-number" aria-hidden="true">{step.number}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></div><a className={`buy-guide-step-art step-${step.number}`} href={step.href} aria-label={step.action} {...(step.number!=="01"?{target:"_blank",rel:"noreferrer"}:{})}><img src={`${art}/${step.image}`} alt={step.alt} width={900} height={850} loading="lazy"/></a></li>)}</ol></section>
    <section className="buy-guide-support" aria-labelledby="buy-guide-support-title"><div className="buy-guide-support-inner"><div className="buy-guide-support-copy"><h2 id="buy-guide-support-title">Te acompañamos<span>en cada paso</span></h2><p>Si tienes dudas, escríbenos. Te ayudaremos a revisar el precio, la disponibilidad y las opciones para reservar tu figura.</p></div><a className="buy-guide-support-chat" href={contact} target="_blank" rel="noreferrer" aria-label="Escribir a Waku Waku por WhatsApp"><img src={`${art}/chat.png`} alt="Mensaje de WhatsApp consultando por una figura" width={900} height={1200} loading="lazy"/></a><a className="buy-guide-support-note" href={contact} target="_blank" rel="noreferrer"><img src={`${art}/support-note.png`} alt="Cuéntanos qué figura te interesa" width={1448} height={1086} loading="lazy"/></a></div></section>
    <section className="buy-guide-faq" aria-labelledby="buy-guide-faq-title"><img className="buy-guide-faq-art" src={`${art}/collection-cutout.png`} alt="Figuras de Miku y de la asistente Waku Waku junto a sus cajas de colección" width={1100} height={700} loading="lazy"/><div className="buy-guide-faq-copy"><h2 id="buy-guide-faq-title">Preguntas <span>frecuentes</span></h2><p>Todo lo que necesitas saber para elegir, separar y recibir tu próxima figura.</p>{faqs.map((faq, index) => <details key={faq.question} open={index === 0}><summary><CircleHelp size={24} aria-hidden="true"/><span>{faq.question}</span><ChevronDown size={18} aria-hidden="true"/></summary><p>{faq.answer}</p></details>)}</div></section>
  </main></StorefrontShell>;
}



