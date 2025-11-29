import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AppLayout from "./layouts/AppLayout";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import Login from "./Components/Login/Login";
import Dashboard from "./Components/Dashboard/Dashboard";
import User from "./Components/User/User";
import Home from "./Components/Home/Order";
import OrderInfo from "./Components/OrderInfo.jsx/NS_OrderInfo";
import AppLication from "./Components/App/AppLication";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AppLayout />}>
          <Route
            element={
              // <ProtectedRoute>
              <AdminLayout />
              //  </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="/ns/order/:orderID" element={<OrderInfo />} />
            <Route path="/user" element={<User />} />
            <Route path="/app" element={<AppLication />} />
          </Route>
          <Route element={<MainLayout />}>

          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
