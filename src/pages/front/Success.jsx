// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
const Success = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/', { replace: true })
    }, 2000)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="container-lg mt-5">
      <div className="bg-white p-4 rounded-4 shadow-sm">
        <h2 className="text-primary fw-bold mb-4">成功送出</h2>
        <div className="d-flex justify-content-center align-items-center">
          <motion.svg width="80" height="80" viewBox="0 0 52 52">
            {/* 外圈 */}
            <motion.circle
              cx="26"
              cy="26"
              r="24"
              fill="none"
              stroke="#244a38"
              strokeWidth="4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1.2 }}
              transition={{ duration: 0.5 }}
            />

            {/* 打勾 */}
            <motion.path
              d="M14 27l7 7 17-17"
              fill="none"
              stroke="#244a38"
              strokeWidth="4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }} // 外圈先畫完再畫勾
            />
          </motion.svg>
        </div>
      </div>
    </div>
  )
}

export default Success
