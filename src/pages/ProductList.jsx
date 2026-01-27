import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import { Pagination } from '../components/Components'
import { Link } from 'react-router'

const API_BASE = import.meta.env.VITE_API_BASE

// 請自行替換 API_PATH
const API_PATH = import.meta.env.VITE_API_PATH

const ProductList = () => {
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)

  // 抓取產品資料
  const getProducts = useCallback(async (page = 1) => {
    setLoading(true) // 開始抓資料
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('hexToken='))
        ?.split('=')[1]

      axios.defaults.headers.common.Authorization = token

      const res = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`,
      )

      setProducts(res.data.products)
      setPagination(res.data.pagination)
    }
    catch {
      toast.error('取得產品資料失敗，請稍後再試', {
        position: 'top-right',
        autoClose: 1500,
      })
    }
    finally {
      setLoading(false) // 完成抓取
    }
  }, [])
  // 加入購物車
  const addToCart = async (product, qty = 1) => {
    try {
      await axios.post(
        `${API_BASE}/api/${API_PATH}/cart`,
        {
          data: {
            product_id: product.id,
            qty,
          },
        },
      )

      // 直接使用 product.title
      toast.success(`${product.title} 已加入購物車`, {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
    catch (error) {
      toast.error(error.response?.data?.message || '加入購物車失敗')
    }
  }

  useEffect(() => {
    getProducts()
  }, [getProducts])

  return (
    <div className="container mt-4">
      {loading
        ? (
          <div className="row gy-4 mb-4">
            {[...Array(9)].map((_, i) => (
              <div className="col-4" key={i}>
                <div className="card shadow-lg border-0 h-100 opacity-50">
                  <div className="bg-gray-300 preview-image-main"></div>
                  <div className="card-body">
                    <div className="spinner-border text-primary mb-4" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="bg-gray-200 mb-5"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
        : (
          <>
            <div className="row gy-4 mb-4">
              {
                products.map((product) => {
                  return (
                    <div className="col-4" key={product.id}>
                      <div className="card shadow-lg border-0 h-100">
                        <img src={product.imageUrl} className="card-img-top preview-image-main" alt={product.title} />
                        <div className="card-body bg-primary-100">
                          <h5 className="card-title text-start">
                            {product.title}
                          </h5>
                          <div className="d-flex justify-content-end">
                            {product.origin_price && (
                              <p className="card-text text-secondary me-2">
                                <del>{product.origin_price}</del>
                              </p>
                            )}
                            元 /
                            {product.price}
                            元
                          </div>
                        </div>
                        <div className="d-flex">
                          <Link type="button" to={`/product/${product.id}`} className="btn btn-primary w-50 rounded-0 py-3">查看更多</Link>
                          <button type="button" className="btn btn-danger w-50 rounded-0 py-3" onClick={() => addToCart(product)}>放入購物車</button>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <Pagination
              pagination={pagination}
              changePage={getProducts}
              disabled={loading}
            />
          </>
        )}
      <ToastContainer />
    </div>
  )
}

export default ProductList
