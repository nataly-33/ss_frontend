import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@shared/components/layout/MainLayout";
import { ProtectedRoute } from "./ProtectedRoute";

// Auth Pages
import { LoginPage } from "@modules/auth/pages/LoginPage";
import { RegisterPage } from "@modules/auth/pages/RegisterPage";

// Public Pages
import { HomePage } from "@modules/products/pages/HomePage";
import { ProductsPage } from "@modules/products/pages/ProductsPage";
import { ProductDetailPage } from "@modules/products/pages/ProductDetailPage";

// Protected Pages
import { CartPage } from "@modules/cart/pages/CartPage";
import { CheckoutPage } from "@modules/checkout/pages/CheckoutPage";
import { ProfilePage } from "@modules/customers/pages/ProfilePage";
import { OrdersPage } from "@modules/orders/pages/OrdersPage";
import { OrderDetailPage } from "@modules/orders/pages/OrderDetailPage";
import { FavoritesPage } from "@modules/customers/pages/FavoritesPage";

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes (No Layout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Public Routes (With Layout) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/new-arrivals" element={<ProductsPage />} />
          <Route path="/featured" element={<ProductsPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
