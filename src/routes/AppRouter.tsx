import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { Home } from "../pages/Home";

const VehiclesMock = () => <h2>Módulo de Vehículos en construcción...</h2>;
const SalesMock = () => (
  <h2>Módulo de Facturación (Offline-First) en construcción...</h2>
);
const ReportsMock = () => <h2>Módulo de Reportes en construcción...</h2>;

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/vehicles" element={<VehiclesMock />} />
          <Route path="/sales" element={<SalesMock />} />
          <Route path="/reports" element={<ReportsMock />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
