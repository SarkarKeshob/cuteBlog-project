import moment from 'moment';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
const VideoCard = ({ videoData }) => {
    console.log(videoData);
    return (
        <div className="card bg-base-100 shadow-xl w-[100%]">
            <Link to={`/videodetails/${videoData.id}`}>
                <video className='cursor-pointer rounded-t-xl' src={videoData.videoUrl} muted onMouseOver={(e) => e.target.play()} onMouseOut={(e) => e.target.pause()} />


                <section className=' flex justify-between items-center py-4 px-2'>
                    <div>
                        <p className='font-bold text-base'>{videoData.title}</p>
                    </div>
                    <div>
                        <img className='rounded-full w-12 h-12 mx-auto ring-4 ring-emerald-400 mb-2' src={videoData.userImage} alt="" />
                        <p className='font-bold text-xs'>{videoData.userName}</p>
                        <p className='font-bold text-xs'>{moment(new Date(parseInt(videoData.videoAdded)).toISOString()).fromNow()}</p>
                    </div>
                </section>
            </Link>

        </div>
    );
};

VideoCard.propTypes = {
    videoData: PropTypes.object,
}
export default VideoCard;