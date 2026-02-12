import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Pagination, Spinner } from '../../components/Components'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { createAsyncMessage } from '../../slice/messageSlice'

const API_BASE = import.meta.env.VITE_API_BASE

// 請自行替換 API_PATH
const API_PATH = import.meta.env.VITE_API_PATH

const ProductList = () => {
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [addingId, setAddingId] = useState(null)
  const dispatch = useDispatch()

  // 抓取產品資料
  const getProducts = useCallback(async (page = 1) => {
    setLoading(true) // 開始抓資料
    try {
      const res = await axios.get(
        `${API_BASE}/api/${API_PATH}/products?page=${page}`,
      )

      setProducts(res.data.products)
      setPagination(res.data.pagination)
    }
    catch (error) {
      dispatch(createAsyncMessage(error.response.data))
    }
    finally {
      setLoading(false) // 完成抓取
    }
  }, [])
  // 加入購物車
  const addToCart = async (product, qty = 1) => {
    if (addingId === product.id) return
    try {
      setAddingId(product.id)

      const response = await axios.post(
        `${API_BASE}/api/${API_PATH}/cart`,
        {
          data: {
            product_id: product.id,
            qty,
          },
        },
      )
      // ✅ 直接 dispatch API 訊息
      dispatch(createAsyncMessage(response.data))
    }
    catch (error) {
      dispatch(createAsyncMessage(error.response.data))
    }
    finally {
      setAddingId(null) // 一定要還原
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
                  <div className="card-body d-flex justify-content-center align-items-center">
                    <Spinner />
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
                          <button type="button" className="btn btn-danger w-50 rounded-0 py-3" disabled={addingId === product.id} onClick={() => addToCart(product)}>
                            {addingId === product.id ? '加入中...' : '加入購物車'}
                          </button>
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
    </div>
  )
}

export default ProductList
