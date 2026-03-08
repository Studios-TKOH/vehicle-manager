import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import styles from "@styles/modules/auth.module.css";
import {
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  ShieldCheck,
  User,
} from "lucide-react";

export const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [nombre, setNombre] = useState("");

  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    handleLogin,
    register,
  } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let success = false;

    if (isRegistering) {
      success = await register(nombre, email, password);
    } else {
      success = await handleLogin(e);
    }

    if (success) {
      navigate("/");
    }
  };

  const toggleMode = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsRegistering(!isRegistering);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.authCard}>
        {/* Lado Izquierdo - Branding */}
        <div className={styles.brandSection}>
          <div className={styles.brandDecoration}></div>
          <div className="z-10">
            <ShieldCheck className="mb-6 w-12 h-12 text-blue-300" />
            <h1 className={styles.brandTitle}>
              Gestión Logística
              <br />
              Inteligente
            </h1>
            <p className={styles.brandSubtitle}>
              Sistema Offline-First adaptado a la normativa SUNAT 2026 para el
              rubro automotriz.
            </p>
          </div>
          <div className="z-10">
            <p className="font-mono text-blue-200 text-sm">
              v2.0.0-beta • Conexión Segura
            </p>
          </div>
        </div>

        {/* Lado Derecho - Formulario */}
        <div className={styles.formSection}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>
              {isRegistering ? "Crea tu cuenta" : "Bienvenido de nuevo"}
            </h2>
            <p className={styles.formSubtitle}>
              {isRegistering
                ? "Configura tu negocio como dueño para empezar a facturar."
                : "Ingresa tus credenciales para acceder al sistema."}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className={styles.errorBox}>
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Campo de Nombre - Solo visible en Registro */}
            {isRegistering && (
              <div className={styles.formGroup}>
                <label className={styles.label}>Nombre Completo</label>
                <div className={styles.inputWrapper}>
                  <User className={styles.inputIcon} />
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Ej. Juan Pérez"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.label}>Correo Electrónico</label>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} />
                <input
                  type="email"
                  className={styles.input}
                  placeholder="ejemplo@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Contraseña</label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} />
                <input
                  type="password"
                  className={styles.input}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Link de recuperación de contraseña solo en Login */}
            {!isRegistering && (
              <div className="flex justify-end mb-6">
                <a
                  href="#"
                  className="font-medium text-blue-600 text-sm hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            )}

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" /> Procesando...
                </>
              ) : isRegistering ? (
                "Registrar mi Negocio"
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>

          <p className={styles.registerLink}>
            {isRegistering
              ? "¿Ya tienes una cuenta registrada?"
              : "¿Eres dueño de un lubricentro nuevo?"}
            <a href="#" onClick={toggleMode}>
              {isRegistering ? "Inicia Sesión aquí" : "Regístrate aquí"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
