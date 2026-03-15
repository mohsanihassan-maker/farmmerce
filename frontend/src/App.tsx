import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Cart from './pages/Cart';
import TracePage from './pages/TracePage';
import MealPlanner from './pages/MealPlanner';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import FarmerProfile from './pages/FarmerProfile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';


import ProtectedRoute from './components/ProtectedRoute';
import { AnimatePresence, motion } from 'framer-motion';
import { isSupabaseConfigured } from './supabase';
import { AlertCircle, Terminal } from 'lucide-react';

function App() {
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-red/20 mb-6">
            <AlertCircle className="w-8 h-8 text-brand-red" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Configuration Required</h1>
          <p className="text-white/80 mb-6 leading-relaxed">
            The application is missing critical environment variables. Please ensure the following are set in your Vercel project settings:
          </p>
          <div className="bg-black/30 rounded-lg p-4 text-left font-mono text-sm space-y-2 mb-6 border border-white/10">
            <div className="flex items-center gap-2 text-brand-light">
              <Terminal className="w-4 h-4" />
              <span>VITE_SUPABASE_URL</span>
            </div>
            <div className="flex items-center gap-2 text-brand-light">
              <Terminal className="w-4 h-4" />
              <span>VITE_SUPABASE_ANON_KEY</span>
            </div>
          </div>
          <p className="text-xs text-white/50">
            Once set, redeploy the site to apply the changes.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <NotificationProvider>
        <CartProvider>
          <BrowserRouter>
            <AnimatePresence mode="wait">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
                <Route path="/market" element={<PageWrapper><Marketplace /></PageWrapper>} />
                <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
                <Route path="/trace/:id" element={<PageWrapper><TracePage /></PageWrapper>} />
                <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
                <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
                <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
                <Route path="/reset-password/:token?" element={<PageWrapper><ResetPassword /></PageWrapper>} />

                <Route path="/farmer/:id" element={<PageWrapper><FarmerProfile /></PageWrapper>} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
                  <Route path="/meal-planner" element={<PageWrapper><MealPlanner /></PageWrapper>} />
                  <Route path="/checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
                  <Route path="/orders" element={<PageWrapper><OrderHistory /></PageWrapper>} />
                </Route>
              </Routes>
            </AnimatePresence>
          </BrowserRouter>
        </CartProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export default App;
