import { createHashRouter } from 'react-router-dom'
import FrontLayout from '../layout/FrontLayout'
import AdminLayout from '../layout/AdminLayout'
import Home from '../pages/front/Home'
import ProductList from '../pages/front/ProductList'
import Cart from '../pages/front/Cart'
import Product from '../pages/front/Product'
import NotFound from '../pages/front/NotFound'
import CheckOut from '../pages/front/CheckOut'
import Success from '../pages/front/Success'
import AdminProducts from '../pages/admin/AdminProducts'
import AdminOrders from '../pages/admin/AdminOrders'
import Login from '../pages/Login'

const router = createHashRouter([
  // 前台路由
  {
    path: '/',
    element: <FrontLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'productList',
        element: <ProductList />,
      },
      {
        path: 'product/:id',
        element: <Product />,
      },
      {
        path: 'cart',
        element: <Cart />,
      },
      {
        path: 'checkout',
        element: <CheckOut />,
      },
      {
        path: 'success',
        element: <Success />,
      },
      {
        path: 'login',
        element: <Login />,
      },
    ],
  },
  // 後台路由
  {
    path: 'admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'product',
        element: <AdminProducts />,
      },
      {
        path: 'order',
        element: <AdminOrders />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

export default router
