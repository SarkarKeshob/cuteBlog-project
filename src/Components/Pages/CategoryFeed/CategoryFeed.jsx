import { useParams } from "react-router-dom";
import useFetchCategorizedFeeds from "../../../customHooks/fetchCategorizedFeeds";
import VideoCard from "../../SharedComponents/VideoCard";
import Loader from "../../SharedComponents/Loader";

const CategoryFeed = () => {
    const category = useParams().category;
    const { data, isLoading, isError } = useFetchCategorizedFeeds('category',category);
    if (isLoading) {
        return <Loader />;
    }
    else if (isError) {
        return <h1 className="text-6xl font-bold text-red-600">{isError}</h1>
    }
    else {
        if (data.length > 0) {
            return (
                <div className=" mt-10 lg:mt-15 grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {data.map((videoData) => <VideoCard key={videoData.id} videoData={videoData}></VideoCard>)}
                </div>
            )
        }
        else {
            return <h1 className="text-red-600 font-bold text-3xl mt-10 lg:mt-15">No Video Of This Category Found</h1>
        }
    }

};

export default CategoryFeed;