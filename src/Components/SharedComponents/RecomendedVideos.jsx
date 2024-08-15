import PropTypes from 'prop-types'
import Loader from './Loader';
import useFetchAllFeeds from '../../customHooks/fetchAllFeeds';
import VideoCard from './VideoCard';
const RecomendedVideos = ({currentVideo}) => {
    const allFeeds = useFetchAllFeeds('videos');
    const { data, isLoading, isError } = allFeeds;
    const allRecomendedVideos=data.filter(video=>video.category==currentVideo.category||video.id!=currentVideo.id);
    const shuffledRecomendedVideos=allRecomendedVideos.sort(()=>Math.random()-0.5);
    const recomendedVideos=shuffledRecomendedVideos.slice(0,3);
    
    console.log(recomendedVideos);
    if(isLoading){
        return <Loader/>
    }
    else if(isError){
        return <h1 className='text-5xl text-center'>Something Went Wrong!!!!!</h1>
    }
    else{
        return(<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10 lg:mt-15">
            {recomendedVideos.map((videoData)=><VideoCard key={videoData.id} videoData={videoData}></VideoCard>)}
        </div>)
    }
};
RecomendedVideos.propTypes={
    currentVideo:PropTypes.object,
}
export default RecomendedVideos;