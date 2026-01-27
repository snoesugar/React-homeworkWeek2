import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/Components'

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default MainLayout
