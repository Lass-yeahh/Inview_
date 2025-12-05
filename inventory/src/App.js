import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import StaffLayout from "./components/StaffLayout";
import Login from "./components/Login";
import Register from "./components/Register";
import Products from "./components/Products";
import Reports from "./components/Reports";
import Alerts from "./components/Alerts";
import ProductsStaff from "./components/ProductsStaff";
import StockInOut from "./components/StockInOut";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminLayout />}>
          {/* <Route path="dashboard" element={<AdminDashboard />} /> */}
          <Route path="products" element={<Products />} />
          <Route path="stock" element={<StockInOut />} />
          <Route path="reports" element={<Reports />} />
          <Route path="alerts" element={<Alerts />} />
        </Route>
        <Route path="/staff" element={<StaffLayout />}>
          {/* <Route path="dashboard" element={<StaffDashboard />} /> */}
          <Route path="products" element={<ProductsStaff />} />
          <Route path="stock" element={<StockInOut />} />
          <Route path="alerts" element={<Alerts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
