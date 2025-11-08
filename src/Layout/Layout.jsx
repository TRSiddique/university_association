
import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";
import Navbar from "../Home/Navbar";
import Home from "../Home/Home";



const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
    <Outlet />
      {/* <Home></Home> */}
      <Footer></Footer>
    </div>
  );
};

export default Layout;
