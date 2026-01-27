import { createHashRouter } from 'react-router-dom'
import MainLayout from '../pages/MainLayout'
import App from '../App'
import Home from '../pages/Home'
import ProductList from '../pages/ProductList'
import Cart from '../pages/Cart'

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
        path: 'login',
        element: <App />,
      },
      {
        path: 'Cart',
        element: <Cart />,
      },
    ],
  },
])

export default router
