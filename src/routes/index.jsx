import { createHashRouter } from 'react-router-dom'
import MainLayout from '../pages/MainLayout'
import App from '../App'
import Home from '../pages/Home'
import ProductList from '../pages/ProductList'
import Cart from '../pages/Cart'
import Product from '../pages/Product'
import NotFound from '../pages/NotFound'
import CheckOut from '../pages/CheckOut'
import Success from '../pages/Success'

const router = createHashRouter([
  {
    path: '/',
    element: <MainLayout />,
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
        path: 'login',
        element: <App />,
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
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

export default router
