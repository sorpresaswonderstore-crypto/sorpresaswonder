"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  productCode: string;
  imageUrl: string;
  imageKey: string;
  published: boolean;
  createdAt?: { seconds: number };
}

interface Settings {
  logoUrl?: string | null;
  logoKey?: string | null;
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "default";
}

// ─── Toast Hook ──────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = useCallback(
    (message: string, type: Toast["type"] = "default") => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(
        () => setToasts((prev) => prev.filter((t) => t.id !== id)),
        3000
      );
    },
    []
  );
  return { toasts, show };
}

// ─── Icons ───────────────────────────────────────────────────
function IconTrash() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  );
}

function IconEye({ off }: { off?: boolean }) {
  return off ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  );
}

// ─── Product Form ─────────────────────────────────────────────
interface PendingImage {
  url: string;
  key: string;
}

function EditProductModal({
  product,
  onClose,
  onSave,
  showToast,
}: {
  product: Product;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Product>) => Promise<void>;
  showToast: (msg: string, type?: Toast["type"]) => void;
}) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(product.price.toString());
  const [productCode, setProductCode] = useState(product.productCode);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name || !price || !productCode) {
      showToast("Completa todos los campos requeridos", "error");
      return;
    }

    setSaving(true);
    try {
      await onSave(product.id, {
        name,
        description,
        price: parseFloat(price),
        productCode,
      });
      onClose();
    } catch {
      showToast("Error al actualizar el producto", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Editar Producto</h3>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <form id="edit-product-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="edit-product-name" className="form-label">
                Nombre del Producto *
              </label>
              <input
                id="edit-product-name"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-product-code" className="form-label">
                Código de Producto *
              </label>
              <input
                id="edit-product-code"
                type="text"
                className="form-input"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-product-price" className="form-label">
                Precio (USD) *
              </label>
              <input
                id="edit-product-price"
                type="number"
                className="form-input"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-product-desc" className="form-label">
                Descripción
              </label>
              <textarea
                id="edit-product-desc"
                className="form-input form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="submit"
            form="edit-product-form"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductForm({
  onSuccess,
  showToast,
}: {
  onSuccess: () => void;
  showToast: (msg: string, type?: Toast["type"]) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [productCode, setProductCode] = useState("");
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name || !price || !productCode) {
      showToast("Completa todos los campos requeridos", "error");
      return;
    }
    if (pendingImages.length === 0) {
      showToast("Sube al menos una imagen", "error");
      return;
    }

    setSaving(true);
    try {
      // Create one product per image (or just use the first one as primary)
      for (const img of pendingImages) {
        await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            description,
            price,
            productCode,
            imageUrl: img.url,
            imageKey: img.key,
          }),
        });
      }
      showToast(
        pendingImages.length > 1
          ? `✓ ${pendingImages.length} productos creados en borrador`
          : "✓ Producto creado en borrador",
        "success"
      );
      setName("");
      setDescription("");
      setPrice("");
      setProductCode("");
      setPendingImages([]);
      onSuccess();
    } catch {
      showToast("Error al guardar el producto", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Image upload */}
      <div className="form-group">
        <label className="form-label">
          Imágenes del Producto{" "}
          <span style={{ color: "var(--gray)", fontWeight: 400 }}>
            (1-10 imágenes)
          </span>
        </label>

        {pendingImages.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))",
              gap: 8,
              marginBottom: 12,
            }}
          >
            {pendingImages.map((img, i) => (
              <div key={img.key} style={{ position: "relative" }}>
                <Image
                  src={img.url}
                  alt={`Imagen ${i + 1}`}
                  width={72}
                  height={72}
                  style={{
                    borderRadius: 10,
                    objectFit: "cover",
                    width: "100%",
                    height: 72,
                    border: "1px solid var(--light-gray)",
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setPendingImages((prev) =>
                      prev.filter((p) => p.key !== img.key)
                    )
                  }
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    background: "rgba(0,0,0,0.6)",
                    border: "none",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "white",
                    fontSize: 12,
                  }}
                  aria-label="Eliminar imagen"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <UploadButton
          endpoint="productImage"
          onClientUploadComplete={(res) => {
            if (res) {
              setPendingImages((prev) => [
                ...prev,
                ...res.map((f) => ({ url: f.ufsUrl, key: f.key })),
              ]);
              showToast(`✓ ${res.length} imagen(es) subida(s)`, "success");
            }
          }}
          onUploadError={(err) => {
            showToast(`Error al subir: ${err.message}`, "error");
          }}
          appearance={{
            button:
              "btn btn-secondary btn-sm",
            allowedContent: "text-xs text-gray-400",
          }}
        />
        <p style={{ fontSize: 11, color: "var(--gray)", marginTop: 6 }}>
          Puedes subir hasta 10 imágenes por lote. Cada imagen crea un producto separado.
        </p>
      </div>

      <div className="form-group">
        <label htmlFor="product-name" className="form-label">
          Nombre del Producto *
        </label>
        <input
          id="product-name"
          type="text"
          className="form-input"
          placeholder="ej. Collar Dorado Perla"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="product-code" className="form-label">
          Código de Producto *
        </label>
        <input
          id="product-code"
          type="text"
          className="form-input"
          placeholder="ej. COL-001"
          value={productCode}
          onChange={(e) => setProductCode(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="product-price" className="form-label">
          Precio (USD) *
        </label>
        <input
          id="product-price"
          type="number"
          className="form-input"
          placeholder="ej. 25.00"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="product-desc" className="form-label">
          Descripción
        </label>
        <textarea
          id="product-desc"
          className="form-input form-textarea"
          placeholder="Describe el producto, material, talla, etc."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        style={{ width: "100%", padding: "12px" }}
        disabled={saving}
        id="save-product-btn"
      >
        {saving ? (
          <>
            <span className="spinner" />
            Guardando...
          </>
        ) : (
          "Guardar como Borrador"
        )}
      </button>
    </form>
  );
}

// ─── Logo Section ─────────────────────────────────────────────
function LogoSection({
  settings,
  onUpdate,
  showToast,
}: {
  settings: Settings;
  onUpdate: (s: Settings) => void;
  showToast: (msg: string, type?: Toast["type"]) => void;
}) {
  const [saving, setSaving] = useState(false);

  return (
    <div>
      {settings.logoUrl && (
        <div className="logo-preview">
          <Image
            src={settings.logoUrl}
            alt="Logo actual"
            width={64}
            height={64}
            style={{ borderRadius: 14, objectFit: "cover", border: "1px solid var(--light-gray)" }}
          />
          <div className="logo-preview-info">
            <h4>Logo actual</h4>
            <p>Se muestra en el navbar de la tienda</p>
          </div>
        </div>
      )}

      <UploadButton
        endpoint="logoImage"
        onClientUploadComplete={async (res) => {
          if (!res || res.length === 0) return;
          setSaving(true);
          try {
            const file = res[0];
            await fetch("/api/settings", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                logoUrl: file.ufsUrl,
                logoKey: file.key,
                oldLogoKey: settings.logoKey,
              }),
            });
            onUpdate({ logoUrl: file.ufsUrl, logoKey: file.key });
            showToast("✓ Logo actualizado", "success");
          } catch {
            showToast("Error al guardar el logo", "error");
          } finally {
            setSaving(false);
          }
        }}
        onUploadError={(err) => {
          showToast(`Error al subir: ${err.message}`, "error");
        }}
        appearance={{
          button: "btn btn-outline btn-sm",
        }}
      />
      {saving && (
        <p style={{ fontSize: 12, color: "var(--gray)", marginTop: 8 }}>
          Guardando logo...
        </p>
      )}
      <p style={{ fontSize: 11, color: "var(--gray)", marginTop: 8 }}>
        El logo aparecerá en el navbar de la tienda. Recomendado: 200×200px, fondo transparente.
      </p>
    </div>
  );
}

// ─── Products Table ───────────────────────────────────────────
function ProductsTable({
  products,
  onToggle,
  onEdit,
  onDelete,
}: {
  products: Product[];
  onToggle: (id: string, current: boolean) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}) {
  if (products.length === 0) {
    return (
      <div className="empty-state" style={{ padding: "48px 24px" }}>
        <div className="empty-state-icon">📦</div>
        <h3>Sin productos aún</h3>
        <p>Usa el formulario para agregar tu primer producto.</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="product-table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Producto</th>
            <th>Código</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                <Image
                  src={p.imageUrl}
                  alt={p.name}
                  width={48}
                  height={48}
                  className="product-table-image"
                />
              </td>
              <td>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>{p.name}</div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--gray)",
                    maxWidth: 200,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.description}
                </div>
              </td>
              <td>
                <code
                  style={{
                    fontSize: 12,
                    background: "var(--off-white)",
                    padding: "2px 8px",
                    borderRadius: 6,
                    fontFamily: "monospace",
                  }}
                >
                  {p.productCode}
                </code>
              </td>
              <td>
                <strong>${p.price.toFixed(2)}</strong>
              </td>
              <td>
                <span
                  className={`badge ${p.published ? "badge-published" : "badge-draft"}`}
                >
                  {p.published ? "● Publicado" : "○ Borrador"}
                </span>
              </td>
              <td>
                <div className="table-actions">
                  <button
                    className={`btn btn-sm ${p.published ? "btn-secondary" : "btn-success"}`}
                    onClick={() => onToggle(p.id, p.published)}
                    title={p.published ? "Ocultar del front" : "Publicar en el front"}
                    style={{ gap: 4, padding: "6px 12px" }}
                  >
                    <IconEye off={p.published} />
                    {p.published ? "Ocultar" : "Publicar"}
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => onEdit(p)}
                    title="Editar producto"
                    style={{ padding: "6px 10px" }}
                  >
                    <IconEdit />
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(p.id)}
                    title="Eliminar producto"
                    style={{ padding: "6px 10px" }}
                  >
                    <IconTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────
export default function AdminDashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"products" | "logo">("products");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toasts, show: showToast } = useToast();

  // Auth guard
  useEffect(() => {
    const session = sessionStorage.getItem("sw_admin");
    if (!session || atob(session) !== "Wifi202.") {
      router.replace("/admin");
    }
  }, [router]);

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, sRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/settings"),
      ]);
      const pData = await pRes.json();
      const sData = await sRes.json();
      setProducts(Array.isArray(pData) ? pData : []);
      setSettings(sData);
    } catch (e) {
      console.error(e);
      showToast("Error cargando datos", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleToggle(id: string, currentPublished: boolean) {
    try {
      await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !currentPublished }),
      });
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, published: !currentPublished } : p
        )
      );
      showToast(
        currentPublished ? "Producto ocultado" : "✓ Producto publicado",
        "success"
      );
    } catch {
      showToast("Error al actualizar producto", "error");
    }
  }

  async function handleEditSave(id: string, updates: Partial<Product>) {
    try {
      await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
      showToast("✓ Producto actualizado", "success");
    } catch {
      throw new Error("Failed to update product");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Seguro que deseas eliminar este producto? La imagen también se eliminará."))
      return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast("✓ Producto eliminado", "success");
    } catch {
      showToast("Error al eliminar producto", "error");
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("sw_admin");
    router.push("/admin");
  }

  const published = products.filter((p) => p.published).length;
  const drafts = products.filter((p) => !p.published).length;

  return (
    <div className="admin-page">
      {/* Topbar */}
      <div className="admin-topbar">
        <div className="admin-topbar-inner">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 32,
                height: 32,
                background: "var(--dark-gray)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              W
            </div>
            <span className="admin-topbar-title">Admin — SorpresasWonderStore</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <a
              href="/"
              target="_blank"
              className="btn btn-secondary btn-sm"
              style={{ textDecoration: "none" }}
            >
              Ver Tienda ↗
            </a>
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>
              Salir
            </button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div
        style={{
          background: "var(--white)",
          borderBottom: "1px solid var(--light-gray)",
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "12px 24px",
            display: "flex",
            gap: 32,
          }}
        >
          {[
            { label: "Total Productos", value: products.length },
            { label: "Publicados", value: published },
            { label: "Borradores", value: drafts },
          ].map((stat) => (
            <div key={stat.label}>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "var(--dark-gray)",
                  letterSpacing: -0.5,
                }}
              >
                {loading ? "—" : stat.value}
              </div>
              <div style={{ fontSize: 12, color: "var(--gray)", fontWeight: 500 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="admin-content">
        {/* Left panel — form + logo */}
        <aside>
          <div className="admin-panel">
            <div className="admin-panel-header">
              <h2 className="admin-panel-title">Gestión</h2>
            </div>
            <div className="admin-panel-body">
              <div className="tabs">
                <button
                  className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
                  onClick={() => setActiveTab("products")}
                  id="tab-products"
                >
                  Nuevo Producto
                </button>
                <button
                  className={`tab-btn ${activeTab === "logo" ? "active" : ""}`}
                  onClick={() => setActiveTab("logo")}
                  id="tab-logo"
                >
                  Logo Tienda
                </button>
              </div>

              {activeTab === "products" ? (
                <ProductForm onSuccess={loadData} showToast={showToast} />
              ) : (
                <LogoSection
                  settings={settings}
                  onUpdate={(s) => setSettings((prev) => ({ ...prev, ...s }))}
                  showToast={showToast}
                />
              )}
            </div>
          </div>
        </aside>

        {/* Right panel — products table */}
        <main>
          <div className="admin-panel">
            <div className="admin-panel-header">
              <h2 className="admin-panel-title">
                Productos{" "}
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 400,
                    color: "var(--gray)",
                  }}
                >
                  ({products.length} total)
                </span>
              </h2>
              <button
                className="btn btn-secondary btn-sm"
                onClick={loadData}
                disabled={loading}
                id="refresh-products-btn"
              >
                {loading ? "..." : "↻ Actualizar"}
              </button>
            </div>

            {loading ? (
              <div className="empty-state" style={{ padding: "48px" }}>
                <div
                  className="spinner spinner-dark"
                  style={{ width: 32, height: 32, margin: "0 auto 16px" }}
                />
                <p>Cargando productos...</p>
              </div>
            ) : (
              <ProductsTable
                products={products}
                onToggle={handleToggle}
                onEdit={(p) => setEditingProduct(p)}
                onDelete={handleDelete}
              />
            )}
          </div>
        </main>
      </div>

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleEditSave}
          showToast={showToast}
        />
      )}

      {/* Toast container */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast ${t.type === "success" ? "toast-success" : t.type === "error" ? "toast-error" : ""}`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}
