import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { createAsyncMessage } from '../slice/messageSlice'

const API_BASE = import.meta.env.VITE_API_BASE

const Login = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
  })
  const dispatch = useDispatch()

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
    }
    catch (error) {
      dispatch(createAsyncMessage(error.response.data))
    }
  }

  // 登入送出：取得 token
  const handleSubmitToken = async (data) => {
    try {
      const response = await axios.post(
        `${API_BASE}/admin/signin`,
        {
          username: data.username,
          password: data.password,
        },
      )

      const { token, expired } = response.data

      // 存 token 到 cookie

      // eslint-disable-next-line react-hooks/immutability
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}`

      dispatch(createAsyncMessage(response.data))

      await authorization()
      // 跳轉到後台產品頁
      navigate('/admin/product')
    }
    catch (error) {
      dispatch(createAsyncMessage(error.response.data))
    }
  }
  return (
    <div className="container login">
      <div className="row justify-content-center">
        <h1 className="h3 mb-3 font-weight-normal text-primary">請先登入</h1>
        <div className="col-8">
          <form id="form" className="form-signin" onSubmit={handleSubmit(handleSubmitToken)}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                id="username"
                placeholder="name@example.com"
                {...register('username', {
                  required: {
                    value: true,
                    message: '請填寫帳號',
                  },
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: '帳號格式不正確',
                  },
                })}
                autoFocus
              />
              <label htmlFor="username">帳號</label>
              {errors.username && (
                <div className="text-start invalid-feedback">
                  {errors.username.message}
                </div>
              )}
            </div>
            <div className="form-floating">
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                id="password"
                placeholder="Password"
                {...register('password', { required: '請填寫密碼' })}
              />
              <label htmlFor="password">密碼</label>
              {errors.password && (
                <div className="text-start invalid-feedback">
                  {errors.password.message}
                </div>
              )}
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
    </div>
  )
}

export default Login
