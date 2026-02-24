import { Link } from "react-router-dom";
import styles from "../styles/modules/home.module.css";
import {
  Truck,
  FileText,
  Wrench,
  TrendingUp,
  Users,
  Settings,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const Home = () => {
  return (
    <div className={styles.container}>
      {/* 1. Hero Section (Bienvenida) */}
      <div className={styles.heroCard}>
        <div className={styles.bgDecoration}></div>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <span className={styles.greeting}>Panel de Administración</span>
            <h1 className={styles.title}>¡Hola, Administrador! 👋</h1>
            <p className={styles.subtitle}>
              El sistema <strong>FleetSUNAT 2026</strong> está operando de
              manera óptima. Tienes 3 mantenimientos programados para hoy y la
              sincronización offline está activa.
            </p>

            <div className={styles.glassBadge}>
              <div className={styles.onlineIndicator}></div>
              Sistema en línea y sincronizado
            </div>
          </div>

          {/* El "Dibujito": Ilustración Vectorial SVG */}
          <div className={styles.illustrationWrapper}>
            <svg
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-2xl"
            >
              {/* Círculo de fondo */}
              <circle cx="100" cy="100" r="80" fill="#60A5FA" opacity="0.2" />
              <circle cx="100" cy="100" r="60" fill="#60A5FA" opacity="0.4" />

              {/* Camión / Furgoneta */}
              <g transform="translate(20, 50)">
                {/* Cabina */}
                <path
                  d="M110 40 L140 40 L150 65 L150 90 L110 90 Z"
                  fill="#E0E7FF"
                />
                {/* Ventana */}
                <path d="M115 45 L135 45 L142 60 L115 60 Z" fill="#93C5FD" />
                {/* Caja del camión */}
                <rect
                  x="10"
                  y="20"
                  width="100"
                  height="70"
                  rx="8"
                  fill="#FFFFFF"
                />
                {/* Franja decorativa de la caja */}
                <rect x="10" y="45" width="100" height="15" fill="#3B82F6" />
                {/* Logo o escudo en la caja */}
                <circle cx="60" cy="52.5" r="12" fill="#FFFFFF" />
                <path d="M56 50 L64 50 L60 56 Z" fill="#3B82F6" />

                {/* Ruedas */}
                <circle cx="40" cy="90" r="14" fill="#1E293B" />
                <circle cx="40" cy="90" r="6" fill="#94A3B8" />
                <circle cx="125" cy="90" r="14" fill="#1E293B" />
                <circle cx="125" cy="90" r="6" fill="#94A3B8" />

                {/* Luces */}
                <rect
                  x="148"
                  y="70"
                  width="4"
                  height="8"
                  rx="2"
                  fill="#FCD34D"
                />
                <rect x="8" y="70" width="4" height="8" rx="2" fill="#EF4444" />
              </g>

              {/* Nubes / Viento (Sensación de movimiento) */}
              <path
                d="M 20 140 Q 40 130 60 140"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M 140 150 Q 160 140 180 150"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M 160 60 Q 170 50 180 60"
                stroke="#FFFFFF"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                opacity="0.4"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 2. Tarjetas de Métricas (KPIs) */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div
            className={`${styles.statIconWrapper} bg-blue-100 text-blue-600`}
          >
            <Truck className="w-8 h-8" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Vehículos Activos</span>
            <span className={styles.statValue}>24 / 30</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div
            className={`${styles.statIconWrapper} bg-green-100 text-green-600`}
          >
            <TrendingUp className="w-8 h-8" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Facturación del Día</span>
            <span className={styles.statValue}>S/ 4,520.00</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div
            className={`${styles.statIconWrapper} bg-orange-100 text-orange-600`}
          >
            <Wrench className="w-8 h-8" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Mantenimientos Pendientes</span>
            <span className={styles.statValue}>3 Vehículos</span>
          </div>
        </div>
      </div>

      {/* 3. Accesos Rápidos */}
      <div className={styles.quickActions}>
        <h3 className={styles.sectionTitle}>Accesos Rápidos</h3>
        <div className={styles.actionsGrid}>
          <Link to="/sales" className={styles.actionBtn}>
            <FileText className={`${styles.actionIcon} w-8 h-8`} />
            <span>Emitir Factura</span>
          </Link>

          <Link to="/vehicles" className={styles.actionBtn}>
            <Truck className={`${styles.actionIcon} w-8 h-8`} />
            <span>Ver Flota</span>
          </Link>

          <Link to="/clients" className={styles.actionBtn}>
            <Users className={`${styles.actionIcon} w-8 h-8`} />
            <span>Gestión de Clientes</span>
          </Link>

          <button className={styles.actionBtn}>
            <Zap className={`${styles.actionIcon} w-8 h-8`} />
            <span>Sincronizar Offline</span>
          </button>
        </div>
      </div>
    </div>
  );
};
