import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { authApi } from "../services/api";

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendEmail, setResendEmail] = useState("");

  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus("error");
      setMessage("Token de verificare lipsă");
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await authApi.verifyEmail(verificationToken);
      setStatus("success");
      setMessage(
        "Email-ul a fost verificat cu succes! Acum poți adăuga cuvinte în dicționar."
      );

      // Redirect to admin page after 3 seconds
      setTimeout(() => {
        navigate("/admin");
      }, 3000);
    } catch (error: any) {
      setStatus("error");
      setMessage(
        error.response?.data?.message ||
          "Token de verificare invalid sau expirat"
      );
    }
  };

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) return;

    setIsResending(true);
    try {
      await authApi.resendVerification(resendEmail);
      setMessage("Email de verificare trimis cu succes! Verifică-ți inbox-ul.");
    } catch (error: any) {
      setMessage(
        error.response?.data?.message ||
          "Eroare la trimiterea email-ului de verificare"
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="logo-container">
          <img src="/images/logo.png" alt="Cuvinte Banatene" className="logo" />
          <h1 className="logo-text">Cuvinte Banatene</h1>
        </div>

        <div className="verification-content">
          {status === "verifying" && (
            <div className="verification-status">
              <div className="spinner"></div>
              <p>Se verifică email-ul...</p>
            </div>
          )}

          {status === "success" && (
            <div className="verification-success">
              <div className="success-icon">✓</div>
              <h2>Email Verificat!</h2>
              <p>{message}</p>
              <p className="redirect-message">
                Se redirecționează către dicționar...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="verification-error">
              <div className="error-icon">✗</div>
              <h2>Eroare la Verificare</h2>
              <p>{message}</p>

              <div className="resend-section">
                <h3>Rescrie Email de Verificare</h3>
                <form onSubmit={handleResendVerification}>
                  <div className="form-group">
                    <input
                      type="email"
                      placeholder="Adresa de email"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isResending}
                  >
                    {isResending ? "Se trimite..." : "Rescrie Email"}
                  </button>
                </form>
              </div>

              <div className="verification-actions">
                <button
                  onClick={() => navigate("/login")}
                  className="btn btn-secondary"
                >
                  Înapoi la Conectare
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="btn btn-outline"
                >
                  Înregistrare Nouă
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
