import { Outlet, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCartAsync } from '../slice/cartSlice'

const FrontLayout = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()
  const carts = useSelector(state => state.cart.carts)
  const totalQty = carts?.reduce((sum, item) => sum + item.qty, 0) || 0

  const toggleNavbar = () => {
    setIsOpen(prev => !prev)
  }

  const closeNavbar = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    dispatch(getCartAsync())
  }, [dispatch])

  return (
    <>
      <div className="sticky-top bg-primary-100">
        <div className="container-lg">
          <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container-fluid px-0">

              <Link
                className="navbar-brand text-primary fs-3 p-0"
                to="/"
                onClick={closeNavbar}
              >
                美食首頁
                <i className="bi bi-house-fill ms-1"></i>
              </Link>

              <button
                className="navbar-toggler"
                type="button"
                onClick={toggleNavbar}
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div
                className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}
              >
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link
                      className="nav-link px-3 text-primary"
                      to="/productList"
                      onClick={closeNavbar}
                    >
                      產品清單
                      <i className="bi bi-list-stars ms-1"></i>
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      className="nav-link px-3 text-primary"
                      to="/cart"
                      onClick={closeNavbar}
                    >
                      購物車
                      <i className="bi bi-cart-fill ms-1 position-relative">
                        {totalQty > 0 && (
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {totalQty}
                            <span className="visually-hidden">cart items</span>
                          </span>
                        )}
                      </i>
                    </Link>
                  </li>
                </ul>

                <ul className="navbar-nav ms-auto">
                  <li className="nav-item">
                    <Link
                      className="nav-link px-5 text-primary"
                      to="/login"
                      onClick={closeNavbar}
                    >
                      登入
                      <i className="bi bi-person-fill ms-1"></i>
                    </Link>
                  </li>
                </ul>

              </div>
            </div>
          </nav>
        </div>
      </div>

      <Outlet />
    </>
  )
}

export default FrontLayout
