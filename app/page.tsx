"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// ─── Types ─────────────────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  productCode: string;
  imageUrl: string;
  published: boolean;
}

interface Settings {
  logoUrl?: string | null;
}

// ─── Constants ─────────────────────────────────────────────────
const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "584126713437";

// ─── Icons ─────────────────────────────────────────────────────
function IconWhatsApp({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function IconSparkle() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" opacity="0.6" aria-hidden="true">
      <path d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5z" />
    </svg>
  );
}

function IconSun() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

// ─── Theme Toggle ───────────────────────────────────────────────
function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // On mount: read localStorage + system preference
  useEffect(() => {
    const stored = localStorage.getItem("sw-theme");
    if (stored === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    } else if (stored === "light") {
      setDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      // No stored preference — follow system
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDark(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
    setMounted(true);
  }, []);

  // Listen for system preference changes (only when no stored preference)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem("sw-theme");
      if (!stored) {
        setDark(e.matches);
        document.documentElement.classList.toggle("dark", e.matches);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("sw-theme", next ? "dark" : "light");
  }

  // Prevent flash of wrong icon
  if (!mounted) {
    return <div style={{ width: 36, height: 36 }} />;
  }

  return (
    <button
      onClick={toggle}
      className="theme-toggle"
      aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}
      title={dark ? "Modo claro" : "Modo oscuro"}
    >
      <span className="theme-toggle-icon" style={{ transform: dark ? "rotate(360deg)" : "rotate(0deg)" }}>
        {dark ? <IconSun /> : <IconMoon />}
      </span>
    </button>
  );
}

// ─── Scroll Reveal Hook ────────────────────────────────────────
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

// ─── ScrollReveal Component ────────────────────────────────────
function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: 0 | 1 | 2 | 3 | 4 | 5;
}) {
  const ref = useScrollReveal();
  const delayClass = delay > 0 ? `reveal-delay-${delay}` : "";

  return (
    <div ref={ref} className={`reveal ${delayClass} ${className}`}>
      {children}
    </div>
  );
}

// ─── Product Modal ─────────────────────────────────────────────
function ProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const waText = encodeURIComponent(
    `¡Hola! Estoy interesado/a en este producto:\n\n*${product.name}*\n📌 Ref: ${product.productCode}\n💰 Precio: $${product.price.toFixed(2)}\n\n¿Podrías indicarme si está disponible? 🙏`
  );
  const waLink = `https://wa.me/${WA_NUMBER}?text=${waText}`;

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Detalles de ${product.name}`}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: 0, overflow: "hidden" }}
      >
        {/* Image */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1 / 1",
            background: "var(--cream-dark)",
          }}
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 520px) 100vw, 520px"
            style={{ objectFit: "cover" }}
            priority
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, transparent 50%, rgba(26,24,21,0.5) 100%)",
              pointerEvents: "none",
            }}
          />
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              background: "rgba(26,24,21,0.55)",
              backdropFilter: "blur(8px)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 22,
              lineHeight: 1,
              transition: "all 0.2s ease",
              zIndex: 2,
            }}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Details */}
        <div style={{ padding: "28px 28px 32px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--warm-gray)",
              }}
            >
              Ref. {product.productCode}
            </span>
            <span style={{ color: "var(--beige)" }}>·</span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: "var(--gold)",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <IconSparkle />
              Disponible
            </span>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 26,
              fontWeight: 700,
              color: "var(--near-black)",
              lineHeight: 1.15,
              marginBottom: 8,
            }}
          >
            {product.name}
          </h2>

          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 24,
              fontWeight: 700,
              color: "var(--gold-dark)",
              marginBottom: 20,
            }}
          >
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, color: "var(--taupe)" }}>
              USD{" "}
            </span>
            {product.price.toFixed(2)}
          </p>

          <div
            style={{
              width: "100%",
              height: 1,
              background: "var(--champagne)",
              marginBottom: 20,
            }}
          />

          <p
            style={{
              fontSize: 14,
              color: "var(--taupe)",
              lineHeight: 1.7,
              marginBottom: 28,
              whiteSpace: "pre-wrap",
            }}
          >
            {product.description || "Sin descripción adicional. Consulte disponibilidad por WhatsApp."}
          </p>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp btn-lg"
            style={{
              width: "100%",
              justifyContent: "center",
              fontSize: 15,
              padding: "16px 24px",
            }}
          >
            <IconWhatsApp size={22} />
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Product Card ──────────────────────────────────────────────
function ProductCard({
  product,
  onClick,
}: {
  product: Product;
  onClick: (p: Product) => void;
}) {
  const waText = encodeURIComponent(
    `¡Hola! Me interesa este producto:\n\n*${product.name}*\n📌 Ref: ${product.productCode}\n💰 Precio: $${product.price.toFixed(2)}\n\n¿Está disponible? 🙏`
  );
  const waLink = `https://wa.me/${WA_NUMBER}?text=${waText}`;

  return (
    <article className="product-card">
      {/* Image */}
      <div
        className="product-card-image-wrap"
        onClick={() => onClick(product)}
        style={{ cursor: "pointer" }}
        title="Ver detalles"
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 300px"
          style={{ objectFit: "cover" }}
        />
        <div className="product-card-image-overlay" />
        <div className="product-card-quick-view">
          <span className="btn btn-secondary btn-sm" style={{ backdropFilter: "blur(12px)", background: "rgba(255,255,255,0.9)" }}>
            Ver detalles
          </span>
        </div>
        <div className="product-card-wa-badge">
          <IconWhatsApp size={12} />
          Consultar
        </div>
      </div>

      {/* Body */}
      <div className="product-card-body">
        <p className="product-card-code">Ref. {product.productCode}</p>
        <h3
          className="product-card-name"
          onClick={() => onClick(product)}
          style={{ cursor: "pointer" }}
        >
          {product.name}
        </h3>
        <p className="product-card-desc">{product.description}</p>
        <div className="product-card-divider" />
        <div className="product-card-footer">
          <span className="product-card-price">
            <span className="currency">USD </span>
            {product.price.toFixed(2)}
          </span>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
            aria-label={`Consultar ${product.name} por WhatsApp`}
          >
            <IconWhatsApp size={16} />
            Pedir
          </a>
        </div>
      </div>
    </article>
  );
}

// ─── Loading Skeleton ──────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-image" />
          <div className="skeleton-body">
            <div className="skeleton-line" style={{ width: "40%" }} />
            <div className="skeleton-line" style={{ width: "75%" }} />
            <div className="skeleton-line" style={{ width: "50%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Store Page ───────────────────────────────────────────
export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [navbarScrolled, setNavbarScrolled] = useState(false);

  // Navbar scroll effect
  useEffect(() => {
    const handler = () => setNavbarScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Fetch data
  useEffect(() => {
    async function load() {
      try {
        const [pRes, sRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/settings"),
        ]);
        const pData = await pRes.json();
        const sData = await sRes.json();
        setProducts(Array.isArray(pData) ? pData : []);
        setSettings(sData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const waGeneralLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    "¡Hola! Quisiera conocer más sobre sus productos. ¿Podrían darme información? 😊"
  )}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* ════════════════════ NAVBAR ════════════════════ */}
      <nav className={`navbar${navbarScrolled ? " scrolled" : ""}`}>
        <div className="container navbar-inner">
          <a href="/" className="navbar-brand">
            {settings.logoUrl ? (
              <Image
                src={settings.logoUrl}
                alt="SorpresasWonderStore"
                width={44}
                height={44}
                className="navbar-logo"
              />
            ) : (
              <div className="navbar-logo-placeholder" aria-hidden="true">
                W
              </div>
            )}
            <div className="navbar-brand-text">
              <span className="navbar-name">SorpresasWonderStore</span>
              <span className="navbar-tagline">Bisutería &amp; Accesorios</span>
            </div>
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ThemeToggle />
            <a
              href={waGeneralLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold btn-sm"
            >
              <IconWhatsApp size={16} />
              Contactar
            </a>
          </div>
        </div>
      </nav>

      {/* ════════════════════ HERO ════════════════════ */}
      <header className="hero">
        {/* Ornament */}
        <div className="hero-ornament">
          <span className="bar" />
          <span className="diamond" />
          <span className="bar" />
        </div>

        <div className="container">
          <span className="hero-eyebrow">✨ Nueva Colección 2026</span>
          <h1 className="hero-title">
            Elegancia en<br />
            <span className="accent">cada detalle</span>
          </h1>
          <p className="hero-subtitle">
            Descubre nuestra exclusiva colección de bisutería y accesorios
            modernos. Piezas únicas que cuentan tu estilo.
          </p>
          <div className="hero-actions">
            <a
              href={waGeneralLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold btn-lg"
            >
              <IconWhatsApp size={20} />
              Escríbenos por WhatsApp
            </a>
            <a
              href="#productos"
              className="btn btn-secondary btn-lg"
            >
              Ver Catálogo
              <IconChevronDown />
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll">
          <div className="mouse" />
          <span>Descubre</span>
        </div>
      </header>

      {/* ════════════════════ PRODUCTS ════════════════════ */}
      <section className="section" id="productos" style={{ flex: 1 }}>
        <div className="container">
          <ScrollReveal>
            <div style={{ marginBottom: 48 }}>
              <span className="section-label">
                Catálogo
              </span>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
                <div>
                  <h2 className="section-title">Nuestros Productos</h2>
                  <p className="section-subtitle">
                    {loading
                      ? "Cargando catálogo..."
                      : `${products.length} producto${products.length !== 1 ? "s" : ""} disponible${products.length !== 1 ? "s" : ""}`}
                  </p>
                </div>
                {!loading && products.length > 0 && (
                  <span
                    style={{
                      fontSize: 13,
                      color: "var(--taupe)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Envíos a toda Venezuela 🇻🇪
                  </span>
                )}
              </div>
            </div>
          </ScrollReveal>

          {loading ? (
            <LoadingSkeleton />
          ) : products.length === 0 ? (
            <ScrollReveal>
              <div className="empty-state">
                <span className="empty-state-icon">💎</span>
                <h3>Próximamente</h3>
                <p>
                  Estamos preparando nuestra nueva colección con las piezas
                  más elegantes para ti. Vuelve pronto.
                </p>
                <div className="decorative-divider">
                  <span className="line" />
                  <span className="diamond" />
                  <span className="line" />
                </div>
                <a
                  href={waGeneralLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold"
                  style={{ marginTop: 24 }}
                >
                  <IconWhatsApp size={18} />
                  Notifícame cuando haya novedades
                </a>
              </div>
            </ScrollReveal>
          ) : (
            <div className="product-grid">
              {products.map((product, index) => (
                <ScrollReveal
                  key={product.id}
                  delay={Math.min(index + 1, 5) as 0 | 1 | 2 | 3 | 4 | 5}
                >
                  <ProductCard
                    product={product}
                    onClick={setSelectedProduct}
                  />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════ FEATURES ════════════════════ */}
      {!loading && products.length > 0 && (
        <section className="section" style={{ background: "var(--cream-dark)" }}>
          <div className="container">
            <ScrollReveal>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <span className="section-label">
                  ¿Por qué elegirnos?
                </span>
                <h2 className="section-title" style={{ marginBottom: 8 }}>
                  La excelencia nos distingue
                </h2>
                <p
                  className="section-subtitle"
                  style={{ margin: "0 auto" }}
                >
                  Calidad y dedicación en cada pieza que creamos para ti.
                </p>
              </div>
            </ScrollReveal>

            <div className="features-grid">
              {[
                {
                  icon: "✨",
                  title: "Calidad Superior",
                  desc: "Seleccionamos cuidadosamente cada material para ofrecerte piezas únicas y duraderas.",
                },
                {
                  icon: "📦",
                  title: "Envío Seguro",
                  desc: "Empacamos con amor y aseguramos que tu pedido llegue en perfectas condiciones.",
                },
                {
                  icon: "💬",
                  title: "Atención Personalizada",
                  desc: "Resolvemos todas tus dudas por WhatsApp. Tu satisfacción es nuestra prioridad.",
                },
                {
                  icon: "🎨",
                  title: "Diseños Exclusivos",
                  desc: "Piezas únicas que no encontrarás en ningún otro lugar. Elegancia que te distingue.",
                },
              ].map((feature, i) => (
                <ScrollReveal key={i} delay={Math.min(i + 1, 5) as 0 | 1 | 2 | 3 | 4 | 5}>
                  <div className="feature-card">
                    <span className="feature-icon">{feature.icon}</span>
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-desc">{feature.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════ FOOTER ════════════════════ */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand-section">
              <div className="footer-logo">SorpresasWonderStore</div>
              <p className="footer-desc">
                Bisutería y accesorios elegantes para dama y caballero.
                Calidad, estilo y distinción en cada pieza. Contáctanos
                para pedidos personalizados.
              </p>
            </div>

            <div>
              <h4 className="footer-heading">Enlaces</h4>
              <ul className="footer-links">
                <li>
                  <a href="#productos">Catálogo</a>
                </li>
                <li>
                  <a href={waGeneralLink} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a href="mailto:info@sorpresaswonderstore.com">
                    Correo Electrónico
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="footer-heading">Contacto</h4>
              <ul className="footer-links">
                <li>
                  <span>Valencia, Venezuela</span>
                </li>
                <li>
                  <a href={waGeneralLink} target="_blank" rel="noopener noreferrer">
                    +58 412-6713437
                  </a>
                </li>
                <li>
                  <span>Lun–Sáb 9:00–18:00</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span>
              &copy; {new Date().getFullYear()} SorpresasWonderStore. Todos los
              derechos reservados.
            </span>
            <span>Hecho con 💛 en Venezuela</span>
          </div>
        </div>
      </footer>

      {/* ════════════════════ WHATSAPP FAB ════════════════════ */}
      <a
        href={waGeneralLink}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-fab"
        aria-label="Contactar por WhatsApp"
      >
        <IconWhatsApp size={26} />
        <span className="whatsapp-fab-tooltip">Escríbenos</span>
      </a>

      {/* ════════════════════ PRODUCT MODAL ════════════════════ */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
