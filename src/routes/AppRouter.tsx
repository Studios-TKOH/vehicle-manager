import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "../store";

// Componentes
import { MainLayout } from "../components/layout/MainLayout";
import { Home } from "../pages/Home";
import { Vehicles } from "../pages/Vehicles";
import { Customers } from "../pages/Customers";
import { Products } from "../pages/Products";
import { Sales } from "../pages/Sales";
import { Reports } from "../pages/Reports";
import { Login } from "../pages/Login";
import { Settings } from "../pages/Settings";


export const AppRouter = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* RUTA PÚBLICA: Si está logueado, no puede volver al Login, se va al Dashboard */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />
          }
        />

        {/* RUTAS PRIVADAS: Solo accesibles si isAuthenticated === true */}
        <Route
          element={
            isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/clients" element={<Customers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />{" "}
        </Route>

        {/* CATCH-ALL: Rutas inexistentes */}
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
