import { Link } from "react-router"
export function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f8efe2", padding: "24px", textAlign: "center" }}>
      <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #8d5439, #bf875f)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px", boxShadow: "0 8px 32px rgba(141,84,57,0.3)" }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M12 2v20M2 12h20"/></svg>
      </div>
      <h1 style={{ fontSize: "5rem", fontWeight: 900, color: "#7c2d12", margin: 0, lineHeight: 1 }}>404</h1>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#3a1f13", margin: "12px 0 8px" }}>Page Not Found</h2>
      <p style={{ color: "#8d5439", marginBottom: "32px", maxWidth: "400px", lineHeight: 1.6 }}>
        This page does not exist or has been moved. Return to the parish homepage.
      </p>
      <Link to="/" style={{ background: "linear-gradient(135deg, #8d5439, #bf875f)", color: "white", padding: "14px 32px", borderRadius: "9999px", fontWeight: 700, textDecoration: "none", fontSize: "1rem", boxShadow: "0 4px 20px rgba(141,84,57,0.35)" }}>
        Go to Homepage
      </Link>
      <p style={{ marginTop: "24px", fontSize: "0.85rem", color: "#9e8070" }}>
        St. Francis Cheptarit Catholic Parish &mdash; Mosoriot, Nandi County
      </p>
    </div>
  )
}
