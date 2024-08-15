import { Outlet } from "react-router-dom";
import Navbar from "../SharedComponents/Navbar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RootComponent = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div>
                <Outlet></Outlet>
                <ToastContainer></ToastContainer>
            </div>
        </div>
    );
};

export default RootComponent;