import { useAuth } from "../hooks/useAuth";
import styles from "../styles/modules/Auth.module.css";
import { Mail, Lock, AlertCircle, Loader2, ShieldCheck } from "lucide-react";

export const Login = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    handleLogin,
  } = useAuth();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.authCard}>
        {/* Lado Izquierdo - Branding */}
        <div className={styles.brandSection}>
          <div className={styles.brandDecoration}></div>
          <div className="z-10">
            <ShieldCheck className="w-12 h-12 text-blue-300 mb-6" />
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
            <p className="text-sm text-blue-200 font-mono">
              v2.0.0-beta • Conexión Segura
            </p>
          </div>
        </div>

        {/* Lado Derecho - Formulario */}
        <div className={styles.formSection}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Bienvenido de nuevo</h2>
            <p className={styles.formSubtitle}>
              Ingresa tus credenciales para acceder al sistema.
            </p>
          </div>

          <form onSubmit={handleLogin}>
            {error && (
              <div className={styles.errorBox}>
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
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

            <div className="flex justify-end mb-6">
              <a
                href="#"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" /> Verificando...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>

          <p className={styles.registerLink}>
            ¿Aún no tienes una cuenta en tu empresa?
            <a href="#">Contacta al administrador</a>
          </p>
        </div>
      </div>
    </div>
  );
};
