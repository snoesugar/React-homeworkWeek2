import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <>
      <div className="sticky-top bg-primary-100">
        <div className="container-lg">
          <nav className="navbar navbar-expand-lg">
            <div className="container-fluid px-0">
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
                    <Link className="nav-link px-3 text-primary" to="/admin/product">
                      後台產品清單
                      <i className="bi bi-list-stars ms-1"></i>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link px-3 text-primary" to="/admin/order">
                      後台訂單列表
                      <i className="bi bi-card-checklist ms-1"></i>
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

export default AdminLayout
