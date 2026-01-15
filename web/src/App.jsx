import './App.css'
import { BrowserRouter, Routes, Route,Outlet} from 'react-router-dom'
import Home from './pages/Home.jsx'

import Products from './components/products/Products.jsx'
import AdminPage from './components/admin/AdminPage.jsx'
import Dashboard from './components/admin/Dashboard.jsx'
import UserList from './components/admin/Userlist.jsx'
import Cart from './components/cart/Cart.jsx'
import Navbar from './components/Navbar.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import DetailF from './components/products/detail/detail.jsx'
import VnpayReturn from './components/vnpay/vnpayReturn'

const UserLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet /> {/* Tất cả nội dung trang Home, Products... sẽ hiện ở đây */}
    </>
  );
};
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- NHÓM ROUTE NGƯỜI DÙNG (CÓ NAVBAR) --- */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home/:id" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/detail/:pid" element={<DetailF />} />
          <Route path="/cart/:id" element={<Cart />} />
          <Route path="/vnpay_return" element={<VnpayReturn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* --- NHÓM ROUTE ADMIN (ẨN NAVBAR, CÓ SIDEBAR RIÊNG) --- */}
        <Route path="/admin/:id/*" element={<AdminPage />}>
           <Route index element={<Dashboard />} />
           <Route path="users" element={<UserList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
