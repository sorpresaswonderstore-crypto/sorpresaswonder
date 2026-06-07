"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Store password in sessionStorage for admin session
    const ADMIN_PASS = "Wifi202.";
    if (password === ADMIN_PASS) {
      sessionStorage.setItem("sw_admin", btoa(password));
      router.push("/admin/dashboard");
    } else {
      setError("Contraseña incorrecta. Intenta nuevamente.");
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">W</div>
        <h1 className="admin-login-title">Panel de Administración</h1>
        <p className="admin-login-sub">SorpresasWonderStore — Acceso Privado</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="admin-password" className="form-label">
              Contraseña
            </label>
            <input
              id="admin-password"
              type="password"
              className="form-input"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className="form-error">⚠️ {error}</p>}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "20px", padding: "13px" }}
            disabled={loading}
            id="admin-login-btn"
          >
            {loading ? (
              <>
                <span className="spinner" />
                Verificando...
              </>
            ) : (
              "Ingresar al Panel"
            )}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "24px", fontSize: "12px", color: "var(--gray)" }}>
          <a href="/" style={{ color: "var(--gray)", textDecoration: "none" }}>
            ← Volver a la tienda
          </a>
        </p>
      </div>
    </div>
  );
}
