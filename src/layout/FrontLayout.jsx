import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'

const FrontLayout = () => {
  return (
    <>
      <div className="sticky-top bg-primary-100">
        <div className="container-lg">
          <nav className="navbar navbar-expand-lg">
            <div className="container-fluid px-0">
              <Link
                className="navbar-brand text-primary fs-3 p-0"
                to="/"
              >
                美食首頁
                <i className="bi bi-house-fill"></i>
              </Link>

              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link className="nav-link px-3 text-primary" to="/productList">
                      產品清單
                      <i className="bi bi-list-stars ms-1"></i>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link px-3 text-primary" to="/cart">
                      購物車
                      <i className="bi bi-cart-fill ms-1"></i>
                    </Link>
                  </li>
                </ul>
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item">
                    <Link className="nav-link px-5 text-primary" to="/login">
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
