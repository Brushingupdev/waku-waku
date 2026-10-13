const collectorSlots = ["feature", "top-center", "top-right", "bottom-center", "bottom-right", "float"];

function Silhouette({ warrior = false }: { warrior?: boolean }) {
  return <span className={`skeleton-silhouette ${warrior ? "skeleton-silhouette-warrior" : "skeleton-silhouette-flow"}`}/>;
}

function Caption() {
  return <div className="skeleton-caption"><span className="skeleton-block skeleton-line"/><span className="skeleton-block skeleton-line short"/></div>;
}

function Dots() {
  return <div className="skeleton-dots">{Array.from({length:8}, (_, i) => <span className="skeleton-block" key={i}/>)}</div>;
}

export function LoadingSkeleton({ variant = "catalog" }: { variant?: "catalog" | "collectors" }) {
  return <div className={`loading-skeleton loading-skeleton-${variant}`} role="status" aria-label={variant === "catalog" ? "Cargando catálogo" : "Cargando experiencias"} aria-busy="true">
    <span className="sr-only">{variant === "catalog" ? "Cargando catálogo…" : "Cargando experiencias…"}</span>
    {variant === "collectors" ? <div className="collector-community-mosaic" aria-hidden="true">
      {collectorSlots.map(slot => <div className={`collector-story collector-story-${slot} skeleton-collector`} key={slot}><div className="collector-story-photo skeleton-block"/><div className="collector-story-caption"><Caption/></div></div>)}
    </div> : <div aria-hidden="true">
      <section className="store-catalog-top"><div className="store-featured-wrap"><div className="store-featured">
        {["side", "center", "side"].map((position, i) => <div className={`store-feature-card store-showcase-card ${position} skeleton-hero`} key={i}><div className="skeleton-block skeleton-hero-fill"><Silhouette warrior={i === 0}/></div></div>)}
      </div><Dots/></div></section>
      <div className="skeleton-series-strip">{Array.from({length:5}, (_, i) => <span className="skeleton-block" key={i}/>)}</div>
      <div className="store-home-content">
        {[0,1].map(section => <section className="store-series-section store-collection-carousel" key={section}>
          <div className="store-section-heading"><div className="skeleton-block skeleton-series-heading"/><span className="skeleton-block skeleton-see-all"/></div>
          <div className="store-collection-stage">
            <div className="store-collection-featured skeleton-product"><div className="store-collection-photo skeleton-block"><Silhouette warrior={section === 1}/></div><div className="store-collection-featured-copy"><Caption/><span className="skeleton-block skeleton-cta"/></div></div>
            <div className="store-collection-support">{[0,1,2].map(i => <div className="store-collection-small skeleton-product" key={i}><div className="store-collection-photo skeleton-block"><Silhouette warrior={i % 2 === 0}/></div><div className="store-collection-small-copy"><Caption/><span className="skeleton-block skeleton-cta"/></div></div>)}</div>
          </div><Dots/>
        </section>)}
      </div>
    </div>}
  </div>;
}
