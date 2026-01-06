import { useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'

const API_BASE = "https://ec-course-api.hexschool.io/v2"

// 請自行替換 API_PATH
const API_PATH = "daisy123"

 //產品元件
  const ProductList = ({ products, setTempProduct }) => {
    return (
      <>
        {products && products.length > 0 ? (
          products.map((item) => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.origin_price}</td>
              <td>{item.price}</td>
              <td>{item.is_enabled ? "啟用" : "未啟用"}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => setTempProduct(item)}
                >
                  查看細節
                </button>
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

  //Modal元件
  const TempProduct = ({ tempProduct, closeModal }) => {
  if (!tempProduct) return null;

    return (
      <div
        className="modal show"
        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        tabIndex="-1"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header border-0">
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
                <div className="card-body">
                  <p className="card-text">商品描述：{tempProduct.content}</p>
                  <p className="card-text">商品內容：{tempProduct.description}</p>
                  <div className="d-flex mb-3">
                    <p className="card-text text-secondary">
                      <del>{tempProduct.origin_price}</del>
                    </p>
                    元 / {tempProduct.price} 元
                  </div>
                </div>
                    <div className="accordion" id="accordionExample">
                      <div className="accordion-item border-0">
                        <h2 className="accordion-header" id="headingOne">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            更多圖片
                          </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                          <div className="accordion-body">
                            {tempProduct.imagesUrl?.map((img, index) => (
                            <img key={index} src={img} className="images" alt="副圖" />
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

function App() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(null);

  const closeModal = () => setTempProduct(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // 確認登入是否成功 checkLogin
  const checkLogin = async () => {
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
      alert('登入失敗，請確認帳密')
    }
  }

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
    
    checkLogin(); 
    

  } catch (err) {
    toast.error('登入失敗，請確認帳密', {
      position: "top-right",
      autoClose: 1500
    });
  }
};

  // 先宣告工具 抓取產品資料 getProducts
  const getProducts = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products`
      )
      setProducts(res.data.products)
    } catch {
      alert('取得產品資料失敗，請稍後再試')
    }
  }



  return (
    <>
      {isAuth ? (
        <div className="container">
          <div className="row mt-5">
            <div className="col">
              <h2>產品列表</h2>
              <button type="button" className="btn btn-primary">登出</button>
              <table className="table">
                <thead>
                  <tr>
                    <th>產品名稱</th>
                    <th>原價</th>
                    <th>售價</th>
                    <th>是否啟用</th>
                    <th>查看細節</th>
                  </tr>
                </thead>
                <tbody>
                  <ProductList
                    products={products}
                    setTempProduct={setTempProduct}
                  />
                </tbody>
              </table>
            </div>
          </div>
          <TempProduct tempProduct={tempProduct} closeModal={closeModal} />
        </div>
      ) : (
        <div className="container login">
          <div className="row justify-content-center">
            <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
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
                  <label htmlFor="username">Email address</label>
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
                  <label htmlFor="password">Password</label>
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
