import { useState, useEffect, useRef } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { Modal, Collapse } from 'bootstrap';
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css';
import './App.css'

const API_BASE = import.meta.env.VITE_API_BASE

// 請自行替換 API_PATH
const API_PATH = import.meta.env.VITE_API_PATH

// 產品元件
const ProductList = ({ products, openModal, deleteProduct, setNewProduct, openEditModal }) => {
  return (
    <>
      {products && products.length > 0 ? (
        products.map((item) => (
          <tr key={item.id} className="align-middle">
            <td>{item.title}</td>
            <td>{item.origin_price}</td>
            <td>{item.price}</td>
            <td>{item.is_enabled ? (<span className="badge bg-success">啟用</span>)
            : <span className="badge bg-danger">未啟用</span>}</td>
            <td>
              <button
                className="btn btn-primary"
                disabled={!item.is_enabled}
                onClick={() => openModal(item)}
              >
                查看細節
              </button>
            </td>
            <td>
              <div className="btn-group">
                <button 
                type="button" 
                className="btn btn-outline-primary btn-sm"
                onClick={() => {
                  setNewProduct(item);  // 填入要編輯的資料
                  openEditModal();       // 開啟編輯 modal
                }}
                >
                  編輯
                </button>
                <button 
                type="button" 
                className="btn btn-outline-danger btn-sm"
                onClick={() => deleteProduct(item.id)}
                >
                  刪除
                </button>
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="5">尚無產品資料</td>
        </tr>
      )}
    </>
  );
};

// 查看細節的 Modal元件
const TempProduct = ({ tempProduct, modalRef, closeModal }) => {
  if (!tempProduct) return null;

  const collapseId = `collapse-${tempProduct.id}`;
  const accordionId = `accordion-${tempProduct.id}`;

  return (
    <div className="modal fade" ref={modalRef} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header border-0 bg-primary-100">
            <h5 className="modal-title">
              {tempProduct.title}
              <span className="badge rounded-pill bg-primary ms-2">
                {tempProduct.category}
              </span>
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={closeModal}
              aria-label="Close"
            ></button>
          </div>
          <div className="card border-0">
            <img
              src={tempProduct.imageUrl}
              className="card-img-top primary-image rounded-0"
              alt="主圖"
            />
            <div className="card-body bg-primary-100">
              <p className="card-text">商品描述：{tempProduct.content}</p>
              <p className="card-text">商品內容：{tempProduct.description}</p>
              <div className="d-flex justify-content-end mb-3">
                <p className="card-text text-secondary">
                  <del>{tempProduct.origin_price}</del>
                </p>
                元 / {tempProduct.price} 元
              </div>
            </div>
            <div className="accordion" id={accordionId}>
              <div className="accordion-item border-0">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed product-images"
                    type="button"
                    onClick={() => {
                      const el = document.getElementById(collapseId);
                      if (!el) return;
                      const instance = Collapse.getOrCreateInstance(el);
                      instance.toggle();
                    }}
                  >
                    更多圖片
                  </button>
                </h2>
                <div id={collapseId} className="accordion-collapse collapse">
                  <div className="accordion-body">
                    {tempProduct.imagesUrl?.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        className="images me-3 mb-3"
                        alt={`副圖 ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 新增的 Modal元件
const AddProduct = ({ modalRef, closeAddModal, addNewProduct, newProduct, handleNewProductChange, setNewProduct }) => {
  return (
    <div className="modal fade" 
    ref={modalRef}
    tabIndex="-1"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">建立新的產品</h1>
            <button type="button" className="btn-close" onClick={closeAddModal}></button>
          </div>
          <div className="modal-body">
            <form className="text-start">
              <div className="mb-3">
                <label htmlFor="title" className="form-label">標題</label>
                <input 
                type="text" 
                className="form-control" 
                id="title" 
                value={newProduct.title}
                onChange={handleNewProductChange}
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="content" className="form-label">產品說明</label>
                <input
                  type="text"
                  className="form-control"
                  id="content"
                  value={newProduct.content}
                  onChange={handleNewProductChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">產品描述</label>
                <input
                type="text"
                className="form-control"
                id="description"
                value={newProduct.description}
                onChange={handleNewProductChange}
              />
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">分類</label>
                    <input
                      type="text"
                      className="form-control"
                      id="category"
                      value={newProduct.category}
                      onChange={handleNewProductChange}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="mb-3">
                    <label htmlFor="unit" className="form-label">單位</label>
                    <input
                      type="text"
                      className="form-control"
                      id="unit"
                      value={newProduct.unit}
                      onChange={handleNewProductChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="mb-3">
                    <label htmlFor="origin_price" className="form-label">產品原價</label>
                    <input
                      type="text"
                      className="form-control"
                      id="origin_price"
                      value={newProduct.origin_price}
                      onChange={handleNewProductChange}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="mb-3">
                    <label htmlFor="price" className="form-label">產品售價</label>
                    <input
                      type="text"
                      className="form-control"
                      id="price"
                      value={newProduct.price}
                      onChange={handleNewProductChange}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="is_enabled"
                      checked={newProduct.is_enabled === 1}
                      onChange={(e) => {
                        setNewProduct({
                          ...newProduct,
                          is_enabled: e.target.checked ? 1 : 0
                        });
                      }}
                    />
                    <label className="form-check-label" htmlFor="is_enabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-6">
                  <div className="mb-3">
                    <label htmlFor="imageUrl" className="form-label">輸入主圖網址</label>
                    <input
                      type="text"
                      className="form-control"
                      id="imageUrl"
                      value={newProduct.imageUrl}
                      onChange={handleNewProductChange}
                    />
                    {newProduct.imageUrl && (
                      <div className="mt-2">
                        <img
                          src={newProduct.imageUrl}
                          alt="主圖預覽"
                          className="preview-image"
                        />
                      </div>
                    )}
                  </div>
                </div>
                {(newProduct.imagesUrl || []).map((img, index) => (
                  <div className="col-6" key={index}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor={`imagesUrl${index}`}>輸入圖片網址 {index + 1}</label>
                      <input
                        type="text"
                        className="form-control"
                        id={`imagesUrl${index}`}
                        value={img}
                        onChange={(e) => {
                          const newImages = [...newProduct.imagesUrl];
                          newImages[index] = e.target.value;
                          setNewProduct({
                            ...newProduct,
                            imagesUrl: newImages
                          });
                        }}
                      />
                      {img && (
                        <img
                          src={img}
                          alt={`副圖預覽 ${index + 1}`}
                          className="mt-2 preview-image"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeAddModal}>取消</button>
            <button type="button" className="btn btn-primary" onClick={addNewProduct}>儲存</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 編輯的 Modal元件
const EditProduct = ({ editProductRef, closeEditModal, updateProduct, newProduct, handleNewProductChange, setNewProduct }) => {
  return (
    <div className="modal fade" 
    ref={editProductRef}
    tabIndex="-1"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">編輯產品</h1>
            <button type="button" className="btn-close" onClick={closeEditModal}></button>
          </div>
          <div className="modal-body">
            <form className="text-start">
              <div className="mb-3">
                <label htmlFor="title" className="form-label">標題</label>
                <input 
                type="text" 
                className="form-control" 
                id="title" 
                value={newProduct.title}
                onChange={handleNewProductChange}
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="content" className="form-label">產品說明</label>
                <input
                  type="text"
                  className="form-control"
                  id="content"
                  value={newProduct.content}
                  onChange={handleNewProductChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">產品描述</label>
                <input
                type="text"
                className="form-control"
                id="description"
                value={newProduct.description}
                onChange={handleNewProductChange}
              />
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">分類</label>
                    <input
                      type="text"
                      className="form-control"
                      id="category"
                      value={newProduct.category}
                      onChange={handleNewProductChange}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="mb-3">
                    <label htmlFor="unit" className="form-label">單位</label>
                    <input
                      type="text"
                      className="form-control"
                      id="unit"
                      value={newProduct.unit}
                      onChange={handleNewProductChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="mb-3">
                    <label htmlFor="origin_price" className="form-label">產品原價</label>
                    <input
                      type="text"
                      className="form-control"
                      id="origin_price"
                      value={newProduct.origin_price}
                      onChange={handleNewProductChange}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="mb-3">
                    <label htmlFor="price" className="form-label">產品售價</label>
                    <input
                      type="text"
                      className="form-control"
                      id="price"
                      value={newProduct.price}
                      onChange={handleNewProductChange}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="is_enabled"
                      checked={newProduct.is_enabled === 1}
                      onChange={(e) => {
                        setNewProduct({
                          ...newProduct,
                          is_enabled: e.target.checked ? 1 : 0
                        });
                      }}
                    />
                    <label className="form-check-label" htmlFor="is_enabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-6">
                  <div className="mb-3">
                    <label htmlFor="imageUrl" className="form-label">輸入主圖網址</label>
                    <input
                      type="text"
                      className="form-control"
                      id="imageUrl"
                      value={newProduct.imageUrl}
                      onChange={handleNewProductChange}
                    />
                    {newProduct.imageUrl && (
                      <div className="mt-2">
                        <img
                          src={newProduct.imageUrl}
                          alt="主圖預覽"
                          className="preview-image"
                        />
                      </div>
                    )}
                  </div>
                </div>
                {(newProduct.imagesUrl || []).map((img, index) => (
                  <div className="col-6" key={index}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor={`imagesUrl${index}`}>輸入圖片網址 {index + 1}</label>
                      <input
                        type="text"
                        className="form-control"
                        id={`imagesUrl${index}`}
                        value={img}
                        onChange={(e) => {
                          const newImages = [...newProduct.imagesUrl];
                          newImages[index] = e.target.value;
                          setNewProduct({
                            ...newProduct,
                            imagesUrl: newImages
                          });
                        }}
                      />
                      {img && (
                        <img
                          src={img}
                          alt={`副圖預覽 ${index + 1}`}
                          className="mt-2 preview-image"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeEditModal}>取消</button>
            <button type="button" className="btn btn-primary" onClick={updateProduct}>儲存</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [newProduct, setNewProduct] = useState({
    title: "",
    category: "",
    origin_price: "",
    price: "",
    unit: "",
    description: "",
    content: "",
    is_enabled: 1,
    imageUrl: "",
    imagesUrl: ["", "", "", "", ""]
  })
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const productModalRef = useRef(null);
  const addModalRef = useRef(null);
  const editProductRef = useRef(null);
  const productModalInstance = useRef(null);
  const addModalInstance = useRef(null);
  const editProductInstance = useRef(null);

  /* ---------- 查看細節 ---------- */
  const openModal = (item) => setTempProduct(item);
  const closeModal = () => {
    if (productModalInstance.current) {
      productModalInstance.current.hide();
    }
  };

  /* ---------- 新增 Modal ---------- */
  const openAddModal = () => {
    // 重置 newProduct
    setNewProduct({
      title: "",
      category: "",
      origin_price: "",
      price: "",
      unit: "",
      description: "",
      content: "",
      is_enabled: 0,
      imageUrl: "",
      imagesUrl: ["", "", "", "", ""]
    });

    setIsAddOpen(true);
  };
  const closeAddModal = () => {
    addModalInstance.current.hide();
    setIsAddOpen(false);
  };

  /* ---------- 編輯 Modal ---------- */
  const openEditModal = () => setIsEditOpen(true);
  const closeEditModal = () => {
    if (editProductInstance.current) editProductInstance.current.hide();
    setIsEditOpen(false);
  };

  // 取input裡面的值
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // 取建立產品的值
  const handleNewProductChange = (e) => {
    const { id, value } = e.target;
    setNewProduct({
      ...newProduct,
      [id]: value
    });
  };

  // 確認登入是否成功 checkLogin
  const authorization = async () => {
    try {
      //從 cookie 裡「把 token 拿出來」
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('hexToken='))
        ?.split('=')[1]

      if (!token) return
      // 帶著 token 去跟 API 要驗證
      axios.defaults.headers.common['Authorization'] = token
      await axios.post(`${API_BASE}/api/user/check`)
      setIsAuth(true)
      getProducts()
    } catch {
      toast.error('驗證失敗', {
      position: "top-right",
      autoClose: 1500
    });
    }
  };

  // 登入送出：取得 token 
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_BASE}/admin/signin`,
        {
          username: formData.username,
          password: formData.password,
        }
      );

      const { token, expired } = res.data;

      // 存 token 到 cookie
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;

      // 顯示 Toast
      toast.success('登入成功，正在跳轉頁面...', {
        position: "top-right",
        autoClose: 1500, // 1.5 秒自動消失
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      await authorization(); 
      

    } catch {
      toast.error('登入失敗，請確認帳密', {
        position: "top-right",
        autoClose: 1500
      });
    }
  };

  // 先宣告工具 抓取產品資料 getProducts
  const getProducts = async () => {
    try {
      let page = 1;
      let allProducts = [];
      let hasNext = true;

      while (hasNext) {
        const res = await axios.get(
          `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`
        );

        allProducts = allProducts.concat(res.data.products);
        hasNext = res.data.pagination.has_next;
        page++;
      }

      setProducts(allProducts);
    } catch {
      alert('取得產品資料失敗，請稍後再試');
    }
  };

  // 確認是否登入
  const checkLogin = async () => {
    try {
      await axios.post(`${API_BASE}/api/user/check`);
      toast.success('已登入', {
        position: "top-right",
        autoClose: 1500, // 1.5 秒自動消失
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch {
      toast.error('尚未登入', {
      position: "top-right",
      autoClose: 1500
    });
    }
  };

  // 登出
  const checkLogout = async () => {
    try {
      await axios.post(`${API_BASE}/logout`)
      setIsAuth(false)
      delete axios.defaults.headers.common['Authorization'];
      setProducts([]);
      // 顯示 Toast
      toast.success('登出成功', {
        position: "top-right",
        autoClose: 1500, // 1.5 秒自動消失
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

    } catch {
      toast.error('登出失敗', {
      position: "top-right",
      autoClose: 1500
    });
    }
  };

  // 建立新產品
  const addNewProduct = async () => {
    try {
      await axios.post(
        `${API_BASE}/api/${API_PATH}/admin/product`,
        {
          data: {
            ...newProduct,
            origin_price: Number(newProduct.origin_price),
            price: Number(newProduct.price),
            is_enabled: newProduct.is_enabled
          }
        }
      );

      toast.success('新增產品成功', { autoClose: 1500 });

      closeAddModal();   // 關 Modal
      getProducts();     // 重新抓資料

      // 重置表單
      setNewProduct({
        title: "",
        category: "",
        origin_price: "",
        price: "",
        unit: "",
        description: "",
        content: "",
        is_enabled: "",
        imageUrl: "",
        imagesUrl: ["", "", "", "", ""]
      });

    } catch {
      toast.error('新增產品失敗', {
      position: "top-right",
      autoClose: 1500
    });
    }
  };

  // 刪除所有品項
  const deleteAllProduct = async () => {
    if (!window.confirm('確定要刪除所有品項嗎？')) return;

    try {
      // 1️⃣ 先取得目前所有產品
    const res = await axios.get(
      `${API_BASE}/api/${API_PATH}/admin/products`
    );

    const products = res.data.products;

    if (products.length === 0) {
      toast.info('目前沒有產品可刪除', {
        autoClose: 1500
      });
      return;
    }

    // 2️⃣ 組成刪除請求陣列
    const deleteRequests = products.map(item =>
      axios.delete(
        `${API_BASE}/api/${API_PATH}/admin/product/${item.id}`
      )
    );

    // 3️⃣ 同時刪除所有產品（真的刪資料庫）
    await Promise.all(deleteRequests);

    // 4️⃣ 重新取得產品（畫面同步）
    getProducts();

      toast.success('刪除所有品項成功', {
        position: "top-right",
        autoClose: 1500, // 1.5 秒自動消失
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch {
      toast.error('刪除所有品項失敗', {
      position: "top-right",
      autoClose: 1500
    });
    }
  };

  // 刪除單一品項
  const deleteProduct = async (id) => {
    if (!window.confirm('確定要刪除這個品項嗎？')) return;

    try {
      await axios.delete(
        `${API_BASE}/api/${API_PATH}/admin/product/${id}`,
      )
      
      toast.success('刪除品項成功', {
        position: "top-right",
        autoClose: 1500, // 1.5 秒自動消失
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // 重新取得產品（畫面同步）
      getProducts();

    } catch {
      toast.error('刪除品項失敗', {
      position: "top-right",
      autoClose: 1500
    });
    }
  }

  // 編輯產品資訊
  const updateProduct = async() => {
    try {
      await axios.put(
        `${API_BASE}/api/${API_PATH}/admin/product/${newProduct.id}`,
        {
          data: {
            ...newProduct,
            origin_price: Number(newProduct.origin_price),
            price: Number(newProduct.price)
          }
        }
      );
      
      toast.success('編輯品項成功', {
        position: "top-right",
        autoClose: 1500, // 1.5 秒自動消失
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // 關閉編輯 modal
      if (editProductInstance.current) editProductInstance.current.hide();

      // 重新抓資料
      getProducts();

      // 重置 newProduct
      setNewProduct({
        title: "",
        category: "",
        origin_price: "",
        price: "",
        unit: "",
        description: "",
        content: "",
        is_enabled: "",
        imageUrl: "",
        imagesUrl: ["", "", "", "", ""]
      });

    } catch {
      toast.error('編輯品項失敗', {
      position: "top-right",
      autoClose: 1500
    });
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
          ?.split('=')[1];

        if (!token) return;

        // 設定 axios header
        axios.defaults.headers.common['Authorization'] = token;

        // 驗證 token 是否有效
        await axios.post(`${API_BASE}/api/user/check`);

        // 驗證成功
        setIsAuth(true);
        getProducts();
      } catch {
        // token 過期或失效
        setIsAuth(false);
        delete axios.defaults.headers.common['Authorization'];
      }
    };

    initAuth();
  }, []);

  /* ---------- product modal ---------- */
  useEffect(() => {
  if (!tempProduct || !productModalRef.current) return;

  // Modal
  productModalInstance.current?.dispose();
  productModalInstance.current = new Modal(productModalRef.current);
  productModalInstance.current.show();

  const modalEl = productModalRef.current;

  // ✅【關鍵】初始化 Collapse（toggle: false）
  const collapseEls = modalEl.querySelectorAll('.accordion-collapse');
  collapseEls.forEach(el => {
    new Collapse(el, { toggle: false });
  });

  const handleHidden = () => {
    setTempProduct(null);
    productModalInstance.current?.dispose();
    productModalInstance.current = null;
    modalEl.removeEventListener('hidden.bs.modal', handleHidden);
  };

  modalEl.addEventListener('hidden.bs.modal', handleHidden);
}, [tempProduct]);

  /* ---------- add modal ---------- */
  useEffect(() => {
    if (isAddOpen && addModalRef.current) {
      if (addModalInstance.current) {
        addModalInstance.current.dispose();
        addModalInstance.current = null;
      }

      addModalInstance.current = new Modal(addModalRef.current);
      addModalInstance.current.show();

      const modalEl = addModalRef.current;
      const handleHidden = () => {
        setIsAddOpen(false);
        addModalInstance.current.dispose();
        addModalInstance.current = null;
        modalEl.removeEventListener('hidden.bs.modal', handleHidden);
      };

      modalEl.addEventListener('hidden.bs.modal', handleHidden);
    }
  }, [isAddOpen]);

  /* ---------- edit modal ---------- */
  useEffect(() => {
    if (isEditOpen && editProductRef.current) {
      editProductInstance.current?.dispose();
      editProductInstance.current = new Modal(editProductRef.current);
      editProductInstance.current.show();

      const modalEl = editProductRef.current;
      const handleHidden = () => {
        setIsEditOpen(false);
        editProductInstance.current?.dispose();
        editProductInstance.current = null;
        modalEl.removeEventListener('hidden.bs.modal', handleHidden);
      };

      modalEl.addEventListener('hidden.bs.modal', handleHidden);
    }
  }, [isEditOpen]);

  return (
    <>
      {isAuth ? (
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
          />
          <EditProduct
            editProductRef={editProductRef}
            modalRef={editProductRef}
            closeEditModal={closeEditModal}
            updateProduct={updateProduct}  
            newProduct={newProduct}
            handleNewProductChange={handleNewProductChange}
            setNewProduct={setNewProduct}
          />
          <ToastContainer />
        </div>
      ) : (
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
  );
}

export default App
