import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import useGlobalScrollFade from "./Utils/useGlobalScrollFade";

// Components
import MyNavbar from "./Components/MyNavbar/MyNavbar";
import Footer from "./Components/Footer/Footer";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import AdminRoute from "./Components/AdminRoute/AdminRoute";

// Pages
import LandingPage from "./Pages/LandingPage/LandingPage";
import LoginPage from "./Pages/LoginPage/LoginPage";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import MenuPage from "./Pages/MenuPage/MenuPage";
import FoodDetailPage from "./Pages/FoodDetailPage/FoodDetailPage";
import CartPage from "./Pages/CartPage/CartPage";
import CheckoutPage from "./Pages/CheckoutPage/CheckoutPage";
import PaymentSuccessPage from "./Pages/PaymentSuccessPage/PaymentSuccessPage";
import OrdersPage from "./Pages/OrdersPage/OrdersPage";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";
import NotFoundPage from "./Pages/NotFoundPage/NotFoundPage";

import AdminLayout from "./Pages/AdminLayout/AdminLayout";
import AdminDashboard from "./Pages/Admin/Dashboard/AdminDashboard";
import AdminFoods from "./Pages/Admin/Foods/AdminFoods";
import AdminCategories from "./Pages/Admin/Categories/AdminCategories";
import AdminOrders from "./Pages/Admin/Orders/AdminOrders";
import AdminUsers from "./Pages/Admin/Users/AdminUsers";

import { AuthProvider } from "./Context/AuthContext";
import { CartProvider } from "./Context/CartContext";

function App() {
  const location = useLocation();
  const hideHeaderFooter = ["/login", "/register"].includes(location.pathname) || location.pathname.startsWith("/admin");

  useGlobalScrollFade();

  return (
    <AuthProvider>
      <CartProvider>
        {!hideHeaderFooter && <MyNavbar />}
        
        <main className="min-vh-100">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/menu/:id" element={<FoodDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            
            <Route path="/checkout" element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            } />
            <Route path="/payment-success" element={
              <ProtectedRoute>
                <PaymentSuccessPage />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="foods" element={<AdminFoods />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {!hideHeaderFooter && <Footer />}
        <ToastContainer position="bottom-right" theme="colored" />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
