import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { createAsyncMessage } from '../../slice/messageSlice'
const API_BASE = import.meta.env.VITE_API_BASE
const API_PATH = import.meta.env.VITE_API_PATH

const Product = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState('')
  const [images, setImages] = useState([])
  const [addingId, setAddingId] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`)
        const productData = res.data.product
        setProduct(productData)

        // 使用 imagesUrl 陣列，如果沒有就 fallback 到 main image
        setImages(productData.imagesUrl?.length ? productData.imagesUrl : [productData.imageUrl])
        setMainImage(productData.imageUrl)
      }
      catch (error) {
        dispatch(createAsyncMessage(error.response.data))
      }
      finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const addToCart = async (qty = 1) => {
    if (addingId === product.id) return
    try {
      setAddingId(product.id)
      const response = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
        data: {
          product_id: product.id,
          qty,
        },
      })
      dispatch(createAsyncMessage(response.data))
    }
    catch (error) {
      dispatch(createAsyncMessage(error.response.data))
    }
    finally {
      setAddingId(null) // 一定要還原
    }
  }

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!product) return <p className="text-center mt-5">找不到產品</p>

  return (
    <div className="container mt-5">
      <div className="text-start mb-3">
        <button
          className="btn btn-outline-primary"
          type="button"
          onClick={() => {
            navigate(-1)
          }}
        >
          返回
        </button>
      </div>
      <div className="row bg-white p-4 rounded shadow-sm">
        {/* 左側圖片區 */}
        <div className="col-6">
          <div className="mb-3">
            <img src={mainImage} alt={product.title} className="img-fluid rounded product-main border" />
          </div>
          <div className="d-flex gap-2">
            {images.map((img, index) => (
              <button
                key={index}
                type="button"
                className={`border-0 p-0 rounded ${mainImage === img ? 'opacity-100' : 'opacity-50'}`}
                onClick={() => setMainImage(img)}
              >
                <img
                  src={img}
                  alt={`thumb-${index}`}
                  className={`img-thumbnail product-small ${mainImage === img ? 'active' : ''}`}
                  onClick={() => setMainImage(img)}
                />
              </button>
            ))}
          </div>
        </div>

        {/* 右側資訊區 */}
        <div className="col-6 text-start">
          <span className="badge rounded-pill bg-primary mb-2">
            {product.category}
          </span>
          <h2 className="mb-4 fw-bold">{product.title}</h2>
          <p className="card-text">
            商品描述：
            {product.content}
          </p>
          <p className="card-text">
            商品內容：
            {product.description}
          </p>
          <div className="d-flex align-items-end mb-3">
            <p className="text-danger fw-bold fs-4 mb-0 me-2">
              NT$
              {product.price}
              元
            </p>
            <small className="text-muted me-2">
              <del>{product.origin_price}</del>
              元
            </small>
            <p className="mb-0">
              /
              {product.unit}
            </p>
          </div>
          <button className="btn btn-outline-primary btn-lg w-100 mt-3" disabled={addingId === product.id} onClick={() => addToCart()}>
            {addingId === product.id ? '加入中...' : '加入購物車'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Product
