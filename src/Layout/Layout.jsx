
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Home/Navbar";
import Home from "../components/Home/Home";



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
