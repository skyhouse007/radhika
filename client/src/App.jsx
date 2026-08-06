import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import About from './pages/About';
import Journal from './pages/Journal';
import JournalPost from './pages/JournalPost';
import AdminLogin from './pages/admin/AdminLogin';
import { AdminGuard, AdminLayout } from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminCategories from './pages/admin/AdminCategories';
import AdminJournal from './pages/admin/AdminJournal';
import AdminJournalForm from './pages/admin/AdminJournalForm';
import AdminSubscribers from './pages/admin/AdminSubscribers';
import AdminStory from './pages/admin/AdminStory';
import Workshops from './pages/Workshops';
import WorkshopDetail from './pages/WorkshopDetail';
import AdminWorkshops from './pages/admin/AdminWorkshops';
import AdminWorkshopForm from './pages/admin/AdminWorkshopForm';

function Storefront({ children }) {
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <Storefront>
                  <Home />
                </Storefront>
              }
            />
            <Route
              path="/shop"
              element={
                <Storefront>
                  <Shop />
                </Storefront>
              }
            />
            <Route
              path="/shop/:categorySlug"
              element={
                <Storefront>
                  <Shop />
                </Storefront>
              }
            />
            <Route
              path="/product/:slug"
              element={
                <Storefront>
                  <ProductDetail />
                </Storefront>
              }
            />
            <Route
              path="/cart"
              element={
                <Storefront>
                  <Cart />
                </Storefront>
              }
            />
            <Route
              path="/about"
              element={
                <Storefront>
                  <About />
                </Storefront>
              }
            />
            <Route
              path="/workshops"
              element={
                <Storefront>
                  <Workshops />
                </Storefront>
              }
            />
            <Route
              path="/workshops/:slug"
              element={
                <Storefront>
                  <WorkshopDetail />
                </Storefront>
              }
            />
            <Route
              path="/journal"
              element={
                <Storefront>
                  <Journal />
                </Storefront>
              }
            />
            <Route
              path="/journal/:slug"
              element={
                <Storefront>
                  <JournalPost />
                </Storefront>
              }
            />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminGuard />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/:id" element={<AdminProductForm />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="workshops" element={<AdminWorkshops />} />
                <Route path="workshops/:id" element={<AdminWorkshopForm />} />
                <Route path="story" element={<AdminStory />} />
                <Route path="journal" element={<AdminJournal />} />
                <Route path="journal/:id" element={<AdminJournalForm />} />
                <Route path="subscribers" element={<AdminSubscribers />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
