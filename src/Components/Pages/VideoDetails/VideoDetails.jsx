import { IoHome, IoTrash } from "react-icons/io5";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../../SharedComponents/Loader";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../Firebase/firebase.config";
import { deleteObject, ref } from "firebase/storage";
import Notiflix from "notiflix";
import { useState } from "react";
import useFetchAllFeeds from "../../../customHooks/fetchAllFeeds";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { setModalOpen } from "../../../Redux/Features/modalSlice";
import { nanoid } from "nanoid";
import RecomendedVideos from "../../SharedComponents/RecomendedVideos";

const VideoDetails = () => {
    // This is to get the required data according to the id 
    const id = useParams().id;
    const allFeeds = useFetchAllFeeds('videos');
    const { data, isLoading, isError } = allFeeds;
    const videoDetails = data.find(video => video.id == id);

    // This is to have the delete button and to control the delete function
    const currentUser = useSelector(state => state.activeUser.user);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [commentObject, setCommentObject] = useState({});
    const [editCommentText,setEditCommentText]=useState('');
    const [editModalOpen,setEditModalOpen]=useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // Delete post and video from db 
    const deletePost = async (videoId, videoURL) => {
        setLoading(true);
        setError('');
        try {
            const docRef = doc(db, `videos/${videoId}`);
            
            // Attempt to delete the document
            await deleteDoc(docRef);


            const videoRef = ref(storage, videoURL);
            // Attempt to delete the video object
            await deleteObject(videoRef);
            setLoading(false);
            navigate('/');
        }
        catch (error) {
            setLoading(false);
            console.log(error);
            setError('Something Went Wrong!!!')
        }
    }

    // This is the notification version for delete the post 
    const confirmDelete = (videoId, videoURL) => {
        Notiflix.Confirm.show(
            'Delete Video!!!',
            'You are about to Delete the video',
            'Delete',
            'Cancel',
            function okbtn() {
                deletePost(videoId, videoURL)
            },
            function cancelbtn() {
                //
            }
        )
    }
    // video description controller 
    const [showMore, setShowMore] = useState(false);

    const getVideoDetails = async (videoRef) => {
        const videoSnapshot = await getDoc(videoRef);
        const videoData = videoSnapshot.data();
        return videoData;
    }

    // Like functionality
    const toggleLike = async (videoId, currentUserId) => {
        const videoRef = doc(db, `videos/${videoId}`);
        const videoData = await getVideoDetails(videoRef);
        let upadatedLikes;
        if (videoData.likes.includes(currentUserId)) {
            upadatedLikes = videoData.likes.filter(userId => userId != currentUserId);
        }
        else {
            upadatedLikes = [...(videoData.likes) || [], currentUserId]
        }
        await updateDoc(videoRef, {
            likes: upadatedLikes,
        });
    }

    // dislike functionality 

    const toggleDislike = async (videoId, currentUserId) => {
        const videoRef = doc(db, `videos/${videoId}`);
        const videoData = await getVideoDetails(videoRef);
        let updatedDislikes;
        if (videoData.dislikes.includes(currentUserId)) {
            updatedDislikes = videoData.dislikes.filter(userId => userId != currentUserId)
        }
        else {
            updatedDislikes = [...(videoData.dislikes) || [], currentUserId]
        }
        await updateDoc(videoRef, {
            dislikes: updatedDislikes,
        });
    }

    // comment functionality

    const addComments = async (videoId, currentUser) => {
        const videoRef = doc(db, `videos/${videoId}`);
        const videoData = await getVideoDetails(videoRef);
        const commentData = {
            id: nanoid(),
            addedAt: `${Date.now()}`,
            userId: currentUser.userId,
            userName: currentUser.userName,
            userImage: currentUser.userImage,
            commentText
        }
        const updatedComment = [...videoData.comments, commentData];
        await updateDoc(videoRef, {
            comments: updatedComment,
        });
        setCommentText('')
    }

    // delete a comment
    const deleteComment = async (e, videoId) => {
        const commentId = e.target.parentNode.parentNode.parentNode.parentNode.id;
        const videoRef = doc(db, `videos/${videoId}`);
        const videoData = await getVideoDetails(videoRef);
        const newComments = videoData.comments.filter(comment => comment.id !== commentId);
        await updateDoc(videoRef, {
            comments: newComments,
        });
    }

    // Edit button functionality 

    const editClicked = async (e, videoId) => {
        const videoRef = doc(db, `videos/${videoId}`);
        const videoData = await getVideoDetails(videoRef);
        const commentId = e.target.parentNode.parentNode.parentNode.parentNode.id;
        const selectedComment = videoData.comments.find(comment => comment.id == commentId);
        setCommentObject(selectedComment);
        setEditCommentText(selectedComment.commentText);
        setEditModalOpen(true);
    }

    // Edit a comment on clicking the update button 

    const updateComment=async(videoId)=>{
        const videoRef = doc(db, `videos/${videoId}`);
        const videoData = await getVideoDetails(videoRef);
        const commentId=commentObject.id;
        const unUpdatedComments=videoData.comments.filter(comment=>comment.id!=commentId);
        const updatedComment={...commentObject,commentText:editCommentText,editedAt:`${Date.now()}`};
        const newComments=[...unUpdatedComments,updatedComment];
        await updateDoc(videoRef,{
            comments:newComments,
        });
        setEditModalOpen(false); 
    }
    // return statement
    if (isLoading || loading || !videoDetails) {
        return <Loader />;
    }
    else if (isError) {
        return <h1 className="text-6xl font-bold text-red-600">{isError}</h1>
    }
    else if (error) {
        return <h1 className="text-6xl font-bold text-red-600">{error}</h1>
    }
    else {
        return (
            <div className="ml-10">
                {/* Top section where the button and the title lies  */}
                <section className="flex items-center mb-3">
                    <Link to={'/'}><IoHome size={36} className="border-r pr-3" /></Link>
                    <p className="font-semibold text-sm md:text-base lg:text-lg ml-4">{videoDetails?.title}</p>
                </section>
                {/* Here Starts the video with it's details */}
                <section className="grid md:flex md:items-start">
                    <video src={videoDetails?.videoUrl} controls className=" w-5/6 lg:w-4/6 mb-4 md:mb-0 md:mr-4 lg:mr-6" />

                    {/* These are the functionality buttons and user infos */}
                    <section className="w-full mx-auto">
                        <section className="flex items-center justify-start">
                            <img src={videoDetails?.userImage} alt={videoDetails?.userName} className="w-8 md:w-10 lg:w-12 rounded-full mr-2" />
                            <div className="text-xs">
                                <p >{videoDetails?.userName}</p>
                                <p>{moment(new Date(parseInt(videoDetails?.videoAdded)).toISOString()).fromNow()}</p>
                            </div>
                        </section>
                        <div className="flex justify-start items-center mt-4">
                            {currentUser.userId === videoDetails?.userid && <IoTrash size={25} className="text-red-700 cursor-pointer hover:text-red-500 mr-2"
                                onClick={() => {
                                    confirmDelete(videoDetails?.id, videoDetails?.videoUrl)
                                }
                                } />}
                            <button className="btn btn-success btn-sm md:btn-xs lg:btn-sm"> <a href={videoDetails.videoUrl} onClick={(e)=>e.stopPropagation()} className="decoration-none">Download</a> </button>
                        </div>
                    </section>

                </section>
                {/* then starts the action section.  */}
                <section>

                    {/* This is the like and dislike button section  */}
                    <section className="mt-5 flex items-center w-1/6 pr-8 justify-between">
                        <div className="flex items-center ">
                            <span><FaThumbsUp size={20} className="cursor-pointer" onClick={() => {
                                if (currentUser.userId) {
                                    toggleLike(videoDetails.id, currentUser.userId)
                                }
                                else {
                                    dispatch(setModalOpen())
                                }
                            }} /></span>
                            <p className="font-bold ml-2">{videoDetails?.likes?.length}</p>
                        </div>
                        <div className="flex items-center ">
                            <span><FaThumbsDown size={20} className="cursor-pointer" onClick={() => {
                                if (currentUser.userId) {
                                    toggleDislike(videoDetails.id, currentUser.userId)
                                }
                                else {
                                    dispatch(setModalOpen())
                                }
                            }} /></span>
                            <p className="font-bold ml-2">{videoDetails?.dislikes?.length}</p>
                        </div>
                    </section>
                    {/* This is the video Description section */}
                    <div className="bg-base-200 p-5 my-5">
                        {videoDetails.description && <section className="mt-5 w-full md:w-2/3">
                            <p className="text-sm md:text-lg lg:text-xl text-justify">
                                <span className="font-bold text-lg md:text-2xl lg:text-3xl mr-4">Description:</span> {showMore ? videoDetails?.description : videoDetails?.description.slice(0, 100)}
                                <span>
                                    {showMore ? <button className="btn btn-link p-0 m-0" onClick={() => setShowMore(!showMore)}>Show Less</button> : <button className="btn btn-link" onClick={() => setShowMore(!showMore)}>Show More </button>}
                                </span>
                            </p>

                        </section>}
                    </div>
                    {/* This is the comment section */}
                    <div>
                        {/* Show total comments */}
                        <section className="text-lg md:text-xl lg:text-2xl font-bold">
                            <p>{videoDetails.comments.length} <span className="text-base">Comments</span></p>
                        </section>
                        {/* Add comments section */}
                        <section className="mt-8">
                            <input type="text" name="" id="" onChange={(e) => setCommentText(e.target.value)} placeholder="Write a comment..." value={commentText} className="border-b-2 border-b-slate-700 w-full p-2 focus:border-b-slate-400 overflow-hidden outline-none " />
                            <div className={`flex items-center justify-end mt-2 `}>
                                {
                                    commentText && <>
                                        <button className="mx-4" onClick={() => setCommentText('')}>Cancel</button>
                                        <button className="btn btn-ghost " onClick={() => {
                                            if (currentUser.userId) {
                                                addComments(videoDetails.id, currentUser)
                                            }
                                            else {
                                                dispatch(setModalOpen())
                                            }
                                        }}>Comment</button>
                                    </>
                                }
                            </div>
                        </section>
                        <section className="mt-5">
                            {videoDetails.comments.map((comment, index) => <div id={`${comment.id}`} key={index} className="flex items-center mb-4">
                                <img className="h-10 w-10 rounded-full mr-6" src={comment.userImage} alt={comment.userName} />

                                <div>
                                    <div className="flex items-center">
                                        <p className="text-lg">{comment.userName}</p>
                                        <p className="text-xs ml-4">{moment(new Date(parseInt(comment?.addedAt)).toISOString()).fromNow()}</p>
                                    </div>
                                    <p className="text-sm">{comment.commentText}</p>
                                    <div>
                                        {currentUser.userId == comment.userId && <div className="mt-2">
                                            <button className="btn btn-warning btn-xs mr-2" onClick={(e) => deleteComment(e, videoDetails.id)}>Delete</button>
                                            <button className="btn btn-warning btn-xs ml-2" onClick={(e) => editClicked(e, videoDetails.id)}>Edit</button>

                                        </div>}
                                    </div>
                                </div>

                            </div>)}

                        </section>
                    </div>
                </section>

                {/* modal of editing  */}
                {/* You can open the modal using document.getElementById('ID').showModal() method */}
                
                <dialog open={editModalOpen} className="modal">
                    <div className="modal-box">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={()=>setEditModalOpen(false)}>✕</button>
                        </form>
                        <h3 className="font-bold text-lg">Edit Your Comment</h3>
                        <textarea rows="5" className="overflow-hidden resize-none w-5/6 my-4 mr-4" value={editCommentText} onChange={(e)=>setEditCommentText(e.target.value)}></textarea>
                        <button className="btn btn-success btn-sm w-fit" onClick={()=>updateComment(videoDetails.id)}>Update</button>
                    </div>
                </dialog>

                {/* recomended video section */}

                <div className="mt-4">
                    <h1 className="border-b-2 pb-4 text-2xl md:text-3xl lg:text-4xl text-center">You might also like</h1>
                    <RecomendedVideos currentVideo={videoDetails}/>
                </div>
            </div>
        )
    }
};

export default VideoDetails;