
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
const PrivateRoutes = () => {
    return (
        <>
       <Navbar className="bg-orange-500" />
        <Outlet />
        </>
    )
}
export default PrivateRoutes;