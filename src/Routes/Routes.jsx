import { createBrowserRouter } from "react-router-dom";
import RootComponent from "../Components/RootComponent/RootComponent";
import Home from "../Components/Pages/Home/Home";
import Feed from "../Components/Pages/Feed/Feed";
import Create from "../Components/Pages/Create/Create";
import CategoryFeed from "../Components/Pages/CategoryFeed/CategoryFeed";
import VideoDetails from "../Components/Pages/VideoDetails/VideoDetails";

const router=createBrowserRouter([
    {
        path:'/',
        element:<RootComponent></RootComponent>,
        children:[
            {
                path:'/',
                element:<Home></Home>,
                children:[
                    {
                        path:'/',
                        element:<Feed></Feed>
                    },
                    {
                        path:'/create',
                        element:<Create></Create>
                    },
                    {
                        path:'/categories/:category',
                        element:<CategoryFeed></CategoryFeed>
                    },
                    {
                        path:'/videodetails/:id',
                        element:<VideoDetails/>

                    },
                   
                ]
            }
        ]
    }
])

export default router;