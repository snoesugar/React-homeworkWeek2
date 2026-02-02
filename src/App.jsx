import { useState, useEffect, useRef } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { Modal, Collapse } from 'bootstrap'
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css'
import { ProductList, TempProduct, AddProduct, EditProduct, Pagination } from './components/Components'
import './assets/scss/App.css'

const API_BASE = import.meta.env.VITE_API_BASE

// 請自行替換 API_PATH
const API_PATH = import.meta.env.VITE_API_PATH

function App() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [newProduct, setNewProduct] = useState({
    title: '',
    category: '',
    origin_price: '',
    price: '',
    unit: '',
    description: '',
    content: '',
    is_enabled: 1,
    imageUrl: '',
    imagesUrl: ['', '', '', '', ''],
  })
  const [isAuth, setIsAuth] = useState(false)
  const [products, setProducts] = useState([])
  const [tempProduct, setTempProduct] = useState(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [errors, setErrors] = useState({})
  const [pagination, setPagination] = useState({})
  const productModalRef = useRef(null)
  const addModalRef = useRef(null)
  const editProductRef = useRef(null)
  const productModalInstance = useRef(null)
  const addModalInstance = useRef(null)
  const editProductInstance = useRef(null)

  /* ---------- 查看細節 ---------- */
  const openModal = item => setTempProduct(item)
  const closeModal = () => {
    if (productModalInstance.current) {
      productModalInstance.current.hide()
    }
  }

  /* ---------- 新增 Modal ---------- */
  const openAddModal = () => {
    // 重置 newProduct
    setNewProduct({
      title: '',
      category: '',
      origin_price: '',
      price: '',
      unit: '',
      description: '',
      content: '',
      is_enabled: 0,
      imageUrl: '',
      imagesUrl: ['', '', '', '', ''],
    })

    setIsAddOpen(true)
  }
  const closeAddModal = () => {
    addModalInstance.current.hide()
    setIsAddOpen(false)
    setErrors({}) // 關閉 Modal 時清空錯誤
  }

  /* ---------- 編輯 Modal ---------- */
  const openEditModal = () => setIsEditOpen(true)
  const closeEditModal = () => {
    if (editProductInstance.current) editProductInstance.current.hide()
    setIsEditOpen(false)
    setErrors({}) // 關閉 Modal 時清空錯誤
  }

  // 取帳號密碼input裡面的值
  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData({
      ...formData,
      [id]: value,
    })
  }

  // 取建立產品的值
  const handleNewProductChange = (e) => {
    const { value, id } = e.target
    setNewProduct({
      ...newProduct,
      [id]: value,
    })

    // 有錯就清掉該欄位錯誤
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: '',
      })
    }
  }

  // 確認登入是否成功 checkLogin
  const authorization = async () => {
    try {
      // 從 cookie 裡「把 token 拿出來」
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('hexToken='))
        ?.split('=')[1]

      if (!token) return
      // 帶著 token 去跟 API 要驗證
      // eslint-disable-next-line react-hooks/immutability
      axios.defaults.headers.common['Authorization'] = token
      await axios.post(`${API_BASE}/api/user/check`)
      setIsAuth(true)
      getProducts()
    }
    catch {
      toast.error('驗證失敗', {
        position: 'top-right',
        autoClose: 1500,
      })
    }
  }

  // 登入送出：取得 token
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.post(
        `${API_BASE}/admin/signin`,
        {
          username: formData.username,
          password: formData.password,
        },
      )

      const { token, expired } = res.data

      // 存 token 到 cookie
      // eslint-disable-next-line react-hooks/immutability
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}`

      // 顯示 Toast
      toast.success('登入成功，正在跳轉頁面...', {
        position: 'top-right',
        autoClose: 1500, // 1.5 秒自動消失
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })

      await authorization()
    }
    catch {
      toast.error('登入失敗，請確認帳密', {
        position: 'top-right',
        autoClose: 1500,
      })
    }
  }

  // 先宣告工具 抓取產品資料 getProducts
  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`,
      )

      setProducts(res.data.products) // 只放當頁 10 筆
      setPagination(res.data.pagination) // 分頁資訊
    }
    catch {
      toast.error('取得產品資料失敗，請稍後再試', {
        position: 'top-right',
        autoClose: 1500,
      })
    }
  }

  // 確認是否登入
  const checkLogin = async () => {
    try {
      await axios.post(`${API_BASE}/api/user/check`)
      toast.success('已登入', {
        position: 'top-right',
        autoClose: 1500, // 1.5 秒自動消失
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
    catch {
      toast.error('尚未登入', {
        position: 'top-right',
        autoClose: 1500,
      })
    }
  }

  // 登出
  const checkLogout = async () => {
    try {
      await axios.post(`${API_BASE}/logout`)
      setIsAuth(false)
      delete axios.defaults.headers.common['Authorization']
      setProducts([])
      // 顯示 Toast
      toast.success('登出成功', {
        position: 'top-right',
        autoClose: 1500, // 1.5 秒自動消失
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
    catch {
      toast.error('登出失敗', {
        position: 'top-right',
        autoClose: 1500,
      })
    }
  }

  // 建立新產品
  const addNewProduct = async () => {
    const validateErrors = validateProduct(newProduct)

    if (Object.keys(validateErrors).length > 0) {
      setErrors(validateErrors)
      return
    }

    setErrors({}) // 清空錯誤

    // 通過驗證才送 API

    try {
      await axios.post(
        `${API_BASE}/api/${API_PATH}/admin/product`,
        {
          data: {
            ...newProduct,
            origin_price: Number(newProduct.origin_price),
            price: Number(newProduct.price),
            is_enabled: newProduct.is_enabled,
          },
        },
      )

      toast.success('新增產品成功', { autoClose: 1500 })

      closeAddModal() // 關 Modal
      getProducts() // 重新抓資料

      // 重置表單
      setNewProduct({
        title: '',
        category: '',
        origin_price: '',
        price: '',
        unit: '',
        description: '',
        content: '',
        is_enabled: '',
        imageUrl: '',
        imagesUrl: ['', '', '', '', ''],
      })
    }
    catch (error) {
      const message
        = error?.response?.data?.message || '新增產品失敗，請確認輸入內容'

      toast.error(message, {
        position: 'top-right',
        autoClose: 1500,
      })
    }
  }

  // 刪除所有品項
  const deleteAllProduct = async () => {
    if (!window.confirm('確定要刪除所有品項嗎？')) return

    try {
      // 1️⃣ 先取得目前所有產品
      const res = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products`,
      )

      const products = res.data.products

      if (products.length === 0) {
        toast.info('目前沒有產品可刪除', {
          autoClose: 1500,
        })
        return
      }

      // 2️⃣ 組成刪除請求陣列
      const deleteRequests = products.map(item =>
        axios.delete(
          `${API_BASE}/api/${API_PATH}/admin/product/${item.id}`,
        ),
      )

      // 3️⃣ 同時刪除所有產品（真的刪資料庫）
      await Promise.all(deleteRequests)

      // 4️⃣ 重新取得產品（畫面同步）
      getProducts()

      toast.success('刪除所有品項成功', {
        position: 'top-right',
        autoClose: 1500, // 1.5 秒自動消失
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
    catch {
      toast.error('刪除所有品項失敗', {
        position: 'top-right',
        autoClose: 1500,
      })
    }
  }

  // 刪除單一品項
  const deleteProduct = async (id) => {
    if (!window.confirm('確定要刪除這個品項嗎？')) return

    try {
      await axios.delete(
        `${API_BASE}/api/${API_PATH}/admin/product/${id}`,
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
      getProducts()
    }
    catch {
      toast.error('刪除品項失敗', {
        position: 'top-right',
        autoClose: 1500,
      })
    }
  }

  // 編輯產品資訊
  const updateProduct = async () => {
    const validateErrors = validateProduct(newProduct)

    if (Object.keys(validateErrors).length > 0) {
      setErrors(validateErrors)
      return
    }

    setErrors({}) // 清空錯誤

    // 通過驗證才送 API

    try {
      await axios.put(
        `${API_BASE}/api/${API_PATH}/admin/product/${newProduct.id}`,
        {
          data: {
            ...newProduct,
            origin_price: Number(newProduct.origin_price),
            price: Number(newProduct.price),
          },
        },
      )

      toast.success('編輯品項成功', {
        position: 'top-right',
        autoClose: 1500, // 1.5 秒自動消失
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })

      // 關閉編輯 modal
      closeEditModal()

      // 重新抓資料
      getProducts()

      // 重置 newProduct
      setNewProduct({
        title: '',
        category: '',
        origin_price: '',
        price: '',
        unit: '',
        description: '',
        content: '',
        is_enabled: '',
        imageUrl: '',
        imagesUrl: ['', '', '', '', ''],
      })
    }
    catch (error) {
      const message
        = error?.response?.data?.message || '編輯品項失敗'

      toast.error(message, {
        position: 'top-right',
        autoClose: 1500,
      })
    }
  }

  // 表單驗證資訊
  const validateProduct = (product) => {
    const errors = {}

    if (!product.title?.trim()) {
      errors.title = '請輸入產品名稱'
    }

    if (!product.category?.trim()) {
      errors.category = '請選擇產品分類'
    }

    if (!product.unit?.trim()) {
      errors.unit = '請選擇產品單位'
    }

    if (product.price === '') {
      errors.price = '請輸入產品售價'
    }
    else if (Number(product.price) < 0) {
      errors.price = '售價不可為負數'
    }

    if (product.origin_price === '') {
      errors.origin_price = '請輸入產品原價'
    }
    else if (Number(product.origin_price) < 0) {
      errors.origin_price = '原價不可為負數'
    }

    return errors
  }

  // 檔案上傳
  const handleFileChange = async (e) => {
    const url = `${API_BASE}/api/${API_PATH}/admin/upload`
    const file = e.target.files?.[0]

    if (!file) return

    try {
      const formData = new FormData()
      formData.append('file-to-upload', file)

      let res = await axios.post(url, formData)
      const uploadedImageUrl = res.data.imageUrl

      setNewProduct(pre => ({
        ...pre,
        imageUrl: uploadedImageUrl,
      }))
    }
    catch (error) {
      console.error('Upload error:', error)
    }
  }
  // 確認登入，重整還會在後台
  useEffect(() => {
    const initAuth = async () => {
      try {
        // 從 Cookie 取 token
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('hexToken='))
          ?.split('=')[1]

        if (!token) return

        // 設定 axios header
        axios.defaults.headers.common['Authorization'] = token

        // 驗證 token 是否有效
        await axios.post(`${API_BASE}/api/user/check`)

        // 驗證成功
        setIsAuth(true)
        getProducts()
      }
      catch {
        // token 過期或失效
        setIsAuth(false)
        delete axios.defaults.headers.common['Authorization']
      }
    }

    initAuth()
  }, [])

  /* ---------- product modal ---------- */
  useEffect(() => {
    if (!tempProduct || !productModalRef.current) return

    // Modal
    productModalInstance.current?.dispose()
    productModalInstance.current = new Modal(productModalRef.current)
    productModalInstance.current.show()

    const modalEl = productModalRef.current

    // ✅【關鍵】初始化 Collapse（toggle: false）
    const collapseEls = modalEl.querySelectorAll('.accordion-collapse')
    collapseEls.forEach((el) => {
      new Collapse(el, { toggle: false })
    })

    const handleHidden = () => {
      setTempProduct(null)
      productModalInstance.current?.dispose()
      productModalInstance.current = null
      modalEl.removeEventListener('hidden.bs.modal', handleHidden)
    }

    modalEl.addEventListener('hidden.bs.modal', handleHidden)
  }, [tempProduct])

  /* ---------- add modal ---------- */
  useEffect(() => {
    if (isAddOpen && addModalRef.current) {
      if (addModalInstance.current) {
        addModalInstance.current.dispose()
        addModalInstance.current = null
      }

      addModalInstance.current = new Modal(addModalRef.current)
      addModalInstance.current.show()

      const modalEl = addModalRef.current
      const handleHidden = () => {
        setIsAddOpen(false)
        addModalInstance.current.dispose()
        addModalInstance.current = null
        modalEl.removeEventListener('hidden.bs.modal', handleHidden)
      }

      modalEl.addEventListener('hidden.bs.modal', handleHidden)
    }
  }, [isAddOpen])

  /* ---------- edit modal ---------- */
  useEffect(() => {
    if (isEditOpen && editProductRef.current) {
      editProductInstance.current?.dispose()
      editProductInstance.current = new Modal(editProductRef.current)
      editProductInstance.current.show()

      const modalEl = editProductRef.current
      const handleHidden = () => {
        setIsEditOpen(false)
        editProductInstance.current?.dispose()
        editProductInstance.current = null
        modalEl.removeEventListener('hidden.bs.modal', handleHidden)
      }

      modalEl.addEventListener('hidden.bs.modal', handleHidden)
    }
  }, [isEditOpen])

  return (
    <>
      {isAuth
        ? (
          <div className="container">
            <div className="row mt-5 bg-white form-signin">
              <div className="col">
                <div className="text-end mb-3">
                  <button type="button" className="btn btn-outline-success me-3" onClick={checkLogin}>確認是否登入</button>
                  <button type="button" className="btn btn-outline-primary" onClick={checkLogout}>登出</button>
                </div>
                <h2>產品列表</h2>
                <div className="text-end mb-3">
                  <button type="button" className="btn btn-outline-danger me-3" onClick={deleteAllProduct}>刪除所有品項</button>
                  <button type="button" className="btn btn-outline-primary me-3" onClick={openAddModal}>建立新的產品</button>
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>產品名稱</th>
                      <th>原價</th>
                      <th>售價</th>
                      <th>是否啟用</th>
                      <th>查看細節</th>
                      <th>編輯</th>
                    </tr>
                  </thead>
                  <tbody>
                    <ProductList
                      products={products}
                      openModal={openModal}
                      deleteProduct={deleteProduct}
                      setNewProduct={setNewProduct}
                      openEditModal={openEditModal}
                    />
                  </tbody>
                </table>
              </div>
              <Pagination
                pagination={pagination}
                changePage={getProducts}
              />
            </div>
            <TempProduct
              tempProduct={tempProduct}
              modalRef={productModalRef}
              closeModal={closeModal}
            />
            <AddProduct
              modalRef={addModalRef}
              closeAddModal={closeAddModal}
              addNewProduct={addNewProduct}
              newProduct={newProduct}
              handleNewProductChange={handleNewProductChange}
              setNewProduct={setNewProduct}
              errors={errors}
              handleFileChange={handleFileChange}
            />
            <EditProduct
              editProductRef={editProductRef}
              modalRef={editProductRef}
              closeEditModal={closeEditModal}
              updateProduct={updateProduct}
              newProduct={newProduct}
              handleNewProductChange={handleNewProductChange}
              setNewProduct={setNewProduct}
              errors={errors}
              handleFileChange={handleFileChange}
            />
            <ToastContainer />
          </div>
        )
        : (
          <div className="container login">
            <div className="row justify-content-center">
              <h1 className="h3 mb-3 font-weight-normal text-primary">請先登入</h1>
              <div className="col-8">
                <form id="form" className="form-signin" onSubmit={handleSubmit}>
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className="form-control"
                      id="username"
                      placeholder="name@example.com"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      autoFocus
                    />
                    <label htmlFor="username">帳號</label>
                  </div>
                  <div className="form-floating">
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <label htmlFor="password">密碼</label>
                  </div>
                  <button
                    className="btn btn-lg btn-primary w-100 mt-3"
                    type="submit"
                  >
                    登入
                  </button>
                </form>
              </div>
            </div>
            <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
            <ToastContainer />
          </div>
        )}
    </>
  )
}

export default App
