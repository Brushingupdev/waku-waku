import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { WhatsAppIcon } from "./whatsapp-icon";


export default function StorefrontShell({ active, children, search }: { search?: React.ReactNode; active: "catalogo" | "preventas" | "comprar"; children: React.ReactNode }) {
  return <div className="storefront">
    <header className="store-header">
      <Link prefetch={false} className="store-brand" href="/" aria-label="Waku Waku Store, inicio"><span className="store-brand-symbol"><img className="store-brand-logo" src="/illustrations/waku-logo.png" alt="" /></span><span className="store-brand-words">waku waku<small>STORE</small></span></Link>
      <nav className="store-nav" aria-label="Principal"><Link prefetch={false} className={active === "catalogo" ? "active" : ""} aria-current={active === "catalogo" ? "page" : undefined} href="/">Catálogo</Link><Link prefetch={false} className={active === "preventas" ? "active" : ""} aria-current={active === "preventas" ? "page" : undefined} href="/preventas">Preventas</Link><Link prefetch={false} className={active === "comprar" ? "active" : ""} aria-current={active === "comprar" ? "page" : undefined} href="/como-comprar">Cómo comprar</Link></nav>
      <div className="store-header-actions">{search || <form className="store-catalog-search" action="/" method="get" role="search"><Search size={20} aria-hidden="true"/><input type="search" name="q" placeholder="Buscar personaje, serie o figura..." aria-label="Buscar figuras"/></form>}<a className="store-whatsapp-dark" href="https://wa.me/51937809466" target="_blank" rel="noreferrer"><WhatsAppIcon /> WhatsApp <span>›</span></a></div>
    </header>
    {children}
    <footer className="store-footer store-footer-manga">
      <div className="store-footer-main">
      <div className="store-footer-brand">
        <Link prefetch={false} className="store-footer-brand-link" href="/" aria-label="Waku Waku Store, inicio">
          <img src="/illustrations/waku-logo.png" alt="" className="store-footer-logo" />
          <strong>WAKU WAKU<br />STORE</strong>
        </Link>
        <p className="store-footer-tagline">Más que figuras, <span>es tu historia.</span></p>
        <a className="store-footer-whatsapp" href="https://wa.me/51937809466" target="_blank" rel="noreferrer"><WhatsAppIcon />Consultar por WhatsApp<ChevronRight size={19} /></a>
      </div>
      <div className="store-footer-links">
      <nav aria-label="Enlaces del footer">
        <Link prefetch={false} href="/">Catálogo</Link>
        <Link prefetch={false} href="/preventas">Preventas</Link>
        <Link prefetch={false} href="/como-comprar">Cómo comprar</Link>
        <a href="https://wa.me/51937809466" target="_blank" rel="noreferrer">Contáctanos</a>
      </nav>
      <div className="store-footer-end">
        <div className="store-footer-socials">
          <a href="https://www.instagram.com/wakuwaku.pe/" target="_blank" rel="noreferrer" aria-label="Instagram">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="#" target="_blank" rel="noreferrer" aria-label="TikTok">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
          </a>
          <a href="#" target="_blank" rel="noreferrer" aria-label="YouTube">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
          </a>
          <a href="#" target="_blank" rel="noreferrer" aria-label="Facebook">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
        </div>
        <a className="store-footer-handle" href="https://www.instagram.com/wakuwaku.pe/" target="_blank" rel="noreferrer">@wakuwaku.pe</a>
      </div>
      </div>
      </div>
      <div className="store-footer-bottom">
        <p>© {new Date().getFullYear()} Waku Waku Store. Todos los derechos reservados.</p>
        <p>Para fans, de fans.</p>
      </div>
    </footer>
    <nav className="store-mobile-nav" aria-label="Navegación móvil"><Link prefetch={false} className={active === "catalogo" ? "active" : ""} aria-current={active === "catalogo" ? "page" : undefined} href="/">Catálogo</Link><Link prefetch={false} className={active === "preventas" ? "active" : ""} aria-current={active === "preventas" ? "page" : undefined} href="/preventas">Preventas</Link><Link prefetch={false} className={active === "comprar" ? "active" : ""} aria-current={active === "comprar" ? "page" : undefined} href="/como-comprar">Cómo comprar</Link></nav>
  </div>;
}
