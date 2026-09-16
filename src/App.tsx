import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, Suspense, lazy } from 'react'
import Navbar from './components/Navbar'
import PageLoader from './components/PageLoader'
import ToastContainer from './components/Toast'
import Home from './pages/Home'
import { useThemeStore } from './store/themeStore'

const Cart             = lazy(() => import('./pages/Cart'))
const Checkout         = lazy(() => import('./pages/Checkout'))
const Construction     = lazy(() => import('./pages/Construction'))
const SecurityServices = lazy(() => import('./pages/SecurityServices'))
const Gas               = lazy(() => import('./pages/Gas'))

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
      <Suspense fallback={null}>
        <Routes>
          <Route path="/"                   element={<Home />} />
          <Route path="/cart"               element={<Cart />} />
          <Route path="/checkout"           element={<Checkout />} />
          <Route path="/construction"       element={<Construction />} />
          <Route path="/security-services"  element={<SecurityServices />} />
          <Route path="/gas"                element={<Gas />} />
        </Routes>
      </Suspense>
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
