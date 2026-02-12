import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { Spinner } from '../../components/Components.jsx'
import useMessage from '../../hooks/useMessage.jsx'

const API_BASE = import.meta.env.VITE_API_BASE
const API_PATH = import.meta.env.VITE_API_PATH

const Cart = () => {
  const [cartList, setCartList] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingItem, setLoadingItem] = useState(null)
  const navigate = useNavigate()
  const { showSuccess, showError } = useMessage()

  // 取得購物車
  const getCart = async (showLoading = false) => {
    if (showLoading) setLoading(true) // 開始抓資料
    try {
      const res = await axios.get(
        `${API_BASE}/api/${API_PATH}/cart`,
      )
      setCartList(res.data.data.carts)
    }
    catch (error) {
      showError(error.response.data.message)
    }
    finally {
      if (showLoading) setLoading(false) // 完成抓取
    }
  }

  // 修改商品數量
  const updateCartQty = async (cartId, productId, qty) => {
    if (qty < 1 || loadingItem === cartId) return

    try {
      setLoadingItem(cartId)

      const response = await axios.put(
        `${API_BASE}/api/${API_PATH}/cart/${cartId}`,
        {
          data: {
            product_id: productId,
            qty,
          },
        },
      )
      showSuccess(response.data.message)

      await getCart()
    }
    catch (error) {
      showError(error.response.data.message)
    }
    finally {
      setLoadingItem(null)
    }
  }

  // 刪除購物車所有商品
  const delAllProducts = async () => {
    if (cartList.length === 0) {
      showSuccess('購物車沒有商品')
      return
    }

    try {
      if (!window.confirm('確定要刪除所有品項嗎？')) return
      const response = await axios.delete(
        `${API_BASE}/api/${API_PATH}/carts`,
      )
      getCart() // 重新抓空的購物車

      showSuccess(response.data.message)
    }
    catch (error) {
      showError(error.response.data.message)
    }
  }

  // 刪除購物車單個商品
  const delProduct = async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE}/api/${API_PATH}/cart/${id}`,
      )

      showSuccess(response.data.message)

      // 重新取得產品（畫面同步）
      getCart()
    }
    catch (error) {
      showError(error.response.data.message)
    }
  }

  // 計算購物車總金額
  const totalAmount = cartList.reduce((sum, item) => {
    return sum + item.final_total
  }, 0)

  // 計算總共省下多少錢
  const totalSaved = cartList.reduce((sum, item) => {
    const originTotal = item.product.origin_price * item.qty
    const priceTotal = item.product.price * item.qty
    return sum + (originTotal - priceTotal)
  }, 0)

  // 計算購物車總數
  const totalQty = cartList.reduce((sum, item) => sum + item.qty, 0)

  // 進行結帳
  const handleCheckout = () => {
    if (cartList.length === 0) {
      showError('購物車沒有商品')
      return
    }
    showSuccess('前往結帳流程')
    const timer = setTimeout(() => {
      navigate('/checkout')
    }, 2000)
    return () => clearTimeout(timer)
  }

  useEffect(() => {
    getCart(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="container">
      {
        loading
          ? (
            <div className="d-flex justify-content-center align-items-center text-center mt-5">
              <Spinner />
            </div>
          )
          : (
            <>
              <div className="row mt-5 bg-white p-5 shadow-lg rounded-4">
                <div className="text-end mb-3">
                  <button type="button" className="btn btn-outline-danger me-3" onClick={delAllProducts} disabled={cartList.length === 0}>清空購物車</button>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>項次</th>
                        <th className="w-25">商品</th>
                        <th className="w-25">數量</th>
                        <th>小計</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartList.length > 0
                        ? (
                          cartList.map((item, index) => (
                            <tr key={item.id} className="align-middle">
                              <td>{index + 1}</td>
                              <td className="text-start">
                                <div className="d-flex flex-lg-row flex-column">
                                  <img
                                    src={item.product.imageUrl}
                                    alt={item.id}
                                    className="cart-img rounded-2 border border-1 me-3"
                                  />
                                  <div className="d-flex flex-column justify-content-center">
                                    <p className="fw-bold mb-2">{item.product.title}</p>
                                    <p className="mb-2">
                                      <del className="text-secondary">{item.product.origin_price}</del>
                                      元 /
                                      {item.product.price}
                                      元
                                    </p>
                                    <p className="text-primary-300 mb-0">
                                      省下
                                      {item.product.origin_price * item.qty - item.product.price * item.qty}
                                      元
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="btn-group">
                                  <button
                                    className="btn btn-outline-secondary"
                                    disabled={loadingItem === item.id}
                                    onClick={() => updateCartQty(item.id, item.product.id, item.qty - 1)}
                                  >
                                    −
                                  </button>
                                  <span className="px-3 d-flex align-items-center">{item.qty}</span>
                                  <button
                                    className="btn btn-outline-secondary"
                                    disabled={loadingItem === item.id}
                                    onClick={() => updateCartQty(item.id, item.product.id, item.qty + 1)}
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td>{item.final_total}</td>
                              <td>
                                <button type="button" className="btn btn-link text-danger" onClick={() => delProduct(item.id)}>
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        )
                        : (
                          <tr>
                            <td colSpan="5" className="text-center">
                              購物車沒有商品
                            </td>
                          </tr>
                        )}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="5" className="p-4">
                          <div className="d-flex flex-md-row flex-column justify-content-md-end align-items-center">
                            <span className="text-secondary me-4">
                              共
                              {totalQty}
                              件商品
                            </span>
                            {totalSaved > 0 && (
                              <span className="text-secondary me-4">
                                一共省下
                                <span className="text-danger fw-bold mx-1">
                                  {totalSaved.toLocaleString()}
                                </span>
                                元
                              </span>
                            )}
                            <span className="fs-1 me-5">
                              NT$
                              {totalAmount.toLocaleString()}
                            </span>
                            <button
                              type="button"
                              className="btn btn-primary bg-gradient fs-3 py-2 px-5 rounded-pill"
                              disabled={cartList.length === 0}
                              onClick={handleCheckout}
                            >
                              進行結帳
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </>
          )
      }
    </div>
  )
}

export default Cart
