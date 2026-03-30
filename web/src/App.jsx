import './App.css'
import { BrowserRouter, Routes, Route,Outlet} from 'react-router-dom'
import Home from './pages/Home.jsx'

import Products from './components/products/Products.jsx'
import AdminPage from './components/admin/AdminPage.jsx'
import Dashboard from './components/admin/Dashboard.jsx'
import Cartlist from './components/admin/Cartlist.jsx'
import UserList from './components/admin/Userlist.jsx'
import Cart from './components/cart/Cart.jsx'
import Navbar from './components/Navbar.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import DetailF from './components/products/detail/detail.jsx'
import OrderHistory from './components/Order/OrderHistory.jsx'

import Intro from './components/about/Intro.jsx'
import News from './components/news/News.jsx'
import Contact from './components/contact/Contact.jsx'
import PaymentSuccess from "./components/payos/PaymentSuccess.jsx"; // Đường dẫn tới file vừa tạo

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
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/orders" element={<OrderHistory />} />
        </Route>

        {/* --- NHÓM ROUTE ADMIN (ẨN NAVBAR, CÓ SIDEBAR RIÊNG) --- */}
        <Route path="/admin/:id/*" element={<AdminPage />}>
           <Route index element={<Dashboard />} />
           <Route path="users" element={<UserList />} />
            <Route path="orders" element={<Cartlist />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
