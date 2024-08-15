import useFetchAllFeeds from "../../../customHooks/fetchAllFeeds";
import Loader from "../../SharedComponents/Loader";
import VideoCard from "../../SharedComponents/VideoCard";

const Feed = () => {
    const allFeeds=useFetchAllFeeds('videos');
    const {data,isLoading,isError}=allFeeds;
    console.log(data);
    if(isLoading){
        return <Loader/>
    }

    else if(isError){
        return <h1 className="text-6xl font-bold text-red-500">{isError}</h1>
    }
    else{
        return (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10 lg:mt-15">
                {data.map((videoData)=><VideoCard key={videoData.id} videoData={videoData}></VideoCard>)}
            </div>
        );
    }
};

export default Feed;