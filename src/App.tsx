import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import PageLoader from './components/PageLoader'
import ToastContainer from './components/Toast'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Construction from './pages/Construction'
import SecurityServices from './pages/SecurityServices'
import Gas from './pages/Gas'
import { useThemeStore } from './store/themeStore'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function Layout() {
  const apply = useThemeStore((s) => s.apply)
  useEffect(() => { apply() }, [apply])

  return (
    <>
      <PageLoader />
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/"                   element={<Home />} />
        <Route path="/cart"               element={<Cart />} />
        <Route path="/checkout"           element={<Checkout />} />
        <Route path="/construction"       element={<Construction />} />
        <Route path="/security-services"  element={<SecurityServices />} />
        <Route path="/gas"                element={<Gas />} />
      </Routes>
      <ToastContainer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
