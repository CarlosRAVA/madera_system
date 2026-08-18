import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/shared/components/Layout';
import { NotFoundPage } from '@/shared/components/NotFoundPage';
import {
  ProtectedRoute,
  AdminRoute,
} from '@/features/auth/components/ProtectedRoute';
import { AdminLayout } from '@/features/admin/components/AdminLayout';

const HomePage = lazy(() =>
  import('@/features/menu/pages/HomePage').then((m) => ({
    default: m.HomePage,
  })),
);
const MenuPage = lazy(() =>
  import('@/features/menu/pages/MenuPage').then((m) => ({
    default: m.MenuPage,
  })),
);
const LoginPage = lazy(() =>
  import('@/features/auth/pages/LoginPage').then((m) => ({
    default: m.LoginPage,
  })),
);
const RegisterPage = lazy(() =>
  import('@/features/auth/pages/RegisterPage').then((m) => ({
    default: m.RegisterPage,
  })),
);
const CartPage = lazy(() =>
  import('@/features/cart/pages/CartPage').then((m) => ({
    default: m.CartPage,
  })),
);
const MyOrdersPage = lazy(() =>
  import('@/features/orders/pages/MyOrdersPage').then((m) => ({
    default: m.MyOrdersPage,
  })),
);
const OrderDetailPage = lazy(() =>
  import('@/features/orders/pages/OrderDetailPage').then((m) => ({
    default: m.OrderDetailPage,
  })),
);
const DashboardPage = lazy(() =>
  import('@/features/admin/pages/DashboardPage').then((m) => ({
    default: m.DashboardPage,
  })),
);
const ProductsAdminPage = lazy(() =>
  import('@/features/admin/pages/ProductsAdminPage').then((m) => ({
    default: m.ProductsAdminPage,
  })),
);
const CategoriesAdminPage = lazy(() =>
  import('@/features/admin/pages/CategoriesAdminPage').then((m) => ({
    default: m.CategoriesAdminPage,
  })),
);
const OrdersAdminPage = lazy(() =>
  import('@/features/admin/pages/OrdersAdminPage').then((m) => ({
    default: m.OrdersAdminPage,
  })),
);
const UsersAdminPage = lazy(() =>
  import('@/features/admin/pages/UsersAdminPage').then((m) => ({
    default: m.UsersAdminPage,
  })),
);
const BusinessConfigAdminPage = lazy(() =>
  import('@/features/admin/pages/BusinessConfigAdminPage').then((m) => ({
    default: m.BusinessConfigAdminPage,
  })),
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'menu', element: <MenuPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'cart', element: <CartPage /> },
          { path: 'mis-pedidos', element: <MyOrdersPage /> },
          { path: 'mis-pedidos/:id', element: <OrderDetailPage /> },
        ],
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'productos', element: <ProductsAdminPage /> },
          { path: 'categorias', element: <CategoriesAdminPage /> },
          { path: 'pedidos', element: <OrdersAdminPage /> },
          { path: 'usuarios', element: <UsersAdminPage /> },
          { path: 'negocio', element: <BusinessConfigAdminPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
