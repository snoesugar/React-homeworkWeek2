import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/scss/all.scss'
import { RouterProvider } from 'react-router-dom'
import router from './routes'
import { MessageToast } from './components/Components'

function App() {
  return (
    <>
      <MessageToast />
      <RouterProvider router={router} />
    </>
  )
}

export default App
