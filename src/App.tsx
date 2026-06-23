import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { CartProvider } from "@/store/cart-store";
import { FilterProvider } from "@/store/filter-store";
import { CatalogProvider } from "@/store/catalog-store";
import { SiteSettingsProvider } from "@/store/site-settings-store";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import WhatsAppFloat from "@/components/shared/WhatsAppFloat";
import HomePage from "@/pages/HomePage";
import ProductPage from "@/pages/ProductPage";
import CartPage from "@/pages/CartPage";
import AboutPage from "@/pages/AboutPage";
import NotFound from "@/pages/NotFound";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Login } from "@/pages/admin/Login";
import { Dashboard } from "@/pages/admin/Dashboard";
import { Products } from "@/pages/admin/Products";
import { ProductForm } from "@/pages/admin/ProductForm";
import { Categories } from "@/pages/admin/Categories";
import { Settings } from "@/pages/admin/Settings";

function StoreLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <FilterProvider>
        <SiteSettingsProvider>
          <CatalogProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<StoreLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/product/:slug" element={<ProductPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/haqqimizda" element={<AboutPage />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<Products />} />
                  <Route path="products/new" element={<ProductForm />} />
                  <Route path="products/:slug/edit" element={<ProductForm />} />
                  <Route path="categories" element={<Categories />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </CatalogProvider>
        </SiteSettingsProvider>
      </FilterProvider>
    </CartProvider>
  );
}
