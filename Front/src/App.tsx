import { Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/common/Toast";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import VehicleDetailPage from "./pages/VehicleDetailPage";
import AddVehicle from "./components/vehicle/AddVehicle";
import EditVehicle from "./components/vehicle/EditVehicle";
import SaleHistory from "./pages/SaleHistory";

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--primary-bg)' }}>
        <Header />
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vehicle/:vin" element={<VehicleDetailPage />} />
            <Route path="/edit-vehicle/:vin" element={<EditVehicle />} />
            <Route path="/add-vehicle" element={<AddVehicle />} />
            <Route path="/sales-history" element={<SaleHistory />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
}

export default App;
