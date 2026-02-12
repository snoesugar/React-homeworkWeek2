import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import useMessage from '../hooks/useMessage'

const API_BASE = import.meta.env.VITE_API_BASE

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const { showSuccess, showError } = useMessage()

  const toggleNavbar = () => {
    setIsOpen(prev => !prev)
  }

  const closeNavbar = () => {
    setIsOpen(false)
  }

  // 登出
  const checkLogout = async () => {
    try {
      const response = await axios.post(`${API_BASE}/logout`)
      delete axios.defaults.headers.common['Authorization']
      showSuccess(response.data.message)
      navigate('/login')
    }
    catch (error) {
      showError(error.response.data.message)
    }
  }

  return (
    <>
      <div className="sticky-top bg-primary-100">
        <div className="container-lg">
          <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container-fluid px-0">

              <button
                className="navbar-toggler ms-auto"
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
                      to="/admin/product"
                      onClick={closeNavbar}
                    >
                      後台產品清單
                      <i className="bi bi-list-stars ms-1"></i>
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      className="nav-link px-3 text-primary"
                      to="/admin/order"
                      onClick={closeNavbar}
                    >
                      後台訂單列表
                      <i className="bi bi-card-checklist ms-1"></i>
                    </Link>
                  </li>
                </ul>

                <ul className="navbar-nav ms-auto align-items-lg-center">
                  <li className="nav-item">
                    <Link
                      type="button"
                      className="nav-link text-primary"
                      onClick={checkLogout}
                    >
                      登出
                      <i className="bi bi-person-walking ms-1"></i>
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
