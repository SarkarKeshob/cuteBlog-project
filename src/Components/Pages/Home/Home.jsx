import { useDispatch, useSelector } from "react-redux";
import Loader from "../../SharedComponents/Loader.jsx";
import { useEffect } from "react";
import { trackUser } from "../../../Redux/Features/authSlice.js";
import { Outlet } from "react-router-dom";
import Categories from "../../SharedComponents/Categories.jsx";
const Home = () => {
    const activeUser = useSelector(state => state.activeUser);
    const { isLoading, user } = activeUser;
    console.log(isLoading, user);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(trackUser());
    }, [dispatch])
    if (isLoading) {
        return (<Loader></Loader>);
    }
    else {
        return (
            <>
                <div className="flex mx-5 mt-5 lg:mt-10 lg:mx-10 ">
                    <section className="w-fit">
                        <Categories></Categories>
                    </section>
                    <section className="ml-2 md:ml-5 lg:ml-10 w-full">
                        <Outlet></Outlet>
                    </section>
                </div>
            </>
        );
    }
};

export default Home;