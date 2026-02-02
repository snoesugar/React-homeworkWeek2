import { useEffect } from 'react'
import { useNavigate } from 'react-router'

const NotFound = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/', { replace: true })
    }, 2000)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="container-lg">
      <h2 className="text-primary display-2 fw-bold mt-5 mb-3">網頁404</h2>
      <p className="fs-2">不存在的頁面</p>
      <div className="d-flex row">
        <div className="col-4">
          <img className="img-fluid img-thumbnail" src="https://media.istockphoto.com/id/607928026/photo/number-4-set-of-numbers-from-felt-isolated-on-white.jpg?s=1024x1024&w=is&k=20&c=Y4rn2CLaXrpUeDydK0ta77-JPsFGXuPIzfNGq9aHHW4=" alt="4" />
        </div>
        <div className="col-4">
          <img className="img-fluid img-thumbnail" src="https://media.istockphoto.com/id/623931422/photo/number-0-from-yellow-felt.jpg?s=1024x1024&w=is&k=20&c=lwNiyL4-GgyhYUwqVzGPl9p0cRVTHxtGM_SQSoYD88Y=" alt="4" />
        </div>
        <div className="col-4">
          <img className="img-fluid img-thumbnail" src="https://media.istockphoto.com/id/607928026/photo/number-4-set-of-numbers-from-felt-isolated-on-white.jpg?s=1024x1024&w=is&k=20&c=Y4rn2CLaXrpUeDydK0ta77-JPsFGXuPIzfNGq9aHHW4=" alt="4" />
        </div>
      </div>
    </div>
  )
}

export default NotFound
