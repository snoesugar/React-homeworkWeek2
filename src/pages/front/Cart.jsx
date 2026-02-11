import { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { Spinner } from '../../components/Components.jsx'

const API_BASE = import.meta.env.VITE_API_BASE
const API_PATH = import.meta.env.VITE_API_PATH

const Cart = () => {
  const [cartList, setCartList] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingItem, setLoadingItem] = useState(null)
  const navigate = useNavigate()

  // 取得購物車
  const getCart = async (showLoading = false) => {
    if (showLoading) setLoading(true) // 開始抓資料
    try {
      const res = await axios.get(
        `${API_BASE}/api/${API_PATH}/cart`,
      )
      setCartList(res.data.data.carts)
    }
    catch {
      toast.error('取得購物車失敗', {
        position: 'top-right',
        autoClose: 1500,
      })
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

      await axios.put(
        `${API_BASE}/api/${API_PATH}/cart/${cartId}`,
        {
          data: {
            product_id: productId,
            qty,
          },
        },
      )

      await getCart()
    }
    catch {
      toast.error('更新數量失敗', {
        position: 'top-right',
        autoClose: 1500,
      })
    }
    finally {
      setLoadingItem(null)
    }
  }

  // 刪除購物車所有商品
  const delAllProducts = async () => {
    if (cartList.length === 0) {
      toast.info('購物車沒有商品', {
        position: 'top-right',
        autoClose: 1500,
      })
      return
    }

    try {
      if (!window.confirm('確定要刪除所有品項嗎？')) return
      await axios.delete(
        `${API_BASE}/api/${API_PATH}/carts`,
      )
      getCart() // 重新抓空的購物車

      toast.success('購物車已清空', {
        position: 'top-right',
        autoClose: 1500, // 1.5 秒自動消失
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
    catch {
      toast.error('刪除購物車所有商品失敗', {
        position: 'top-right',
        autoClose: 1500,
      })
    }
  }

  // 刪除購物車單個商品
  const delProduct = async (id) => {
    try {
      await axios.delete(
        `${API_BASE}/api/${API_PATH}/cart/${id}`,
      )

      toast.success('刪除品項成功', {
        position: 'top-right',
        autoClose: 1500, // 1.5 秒自動消失
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })

      // 重新取得產品（畫面同步）
      getCart()
    }
    catch {
      toast.error('刪除品項失敗', {
        position: 'top-right',
        autoClose: 1500,
      })
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
      toast.info('購物車沒有商品', {
        position: 'top-right',
        autoClose: 1500,
      })
      return
    }
    toast.success('前往結帳流程', {
      position: 'top-right',
      autoClose: 1500, // 1.5 秒自動消失
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
    const timer = setTimeout(() => {
      navigate('/checkout')
    }, 2000)
    return () => clearTimeout(timer)
  }

  useEffect(() => {
    getCart(true)
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
              <div className="row mt-5 bg-white form-signin">
                <div className="text-end mb-3">
                  <button type="button" className="btn btn-outline-danger me-3" onClick={delAllProducts} disabled={cartList.length === 0}>清空購物車</button>
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>項次</th>
                      <th>商品</th>
                      <th>數量</th>
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
                            <td className="d-flex text-start">
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
                        <div className="d-flex justify-content-end align-items-center">
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
              <ToastContainer />
            </>
          )
      }
    </div>
  )
}

export default Cart
