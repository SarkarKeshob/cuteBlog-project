import { useState } from "react";
import { category, } from "../../../Data/Data";
import { IoCloudUpload, IoTrash } from "react-icons/io5";
import { db, storage } from "../../../Firebase/firebase.config";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useSelector } from "react-redux";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Create = () => {
    const [title, setTitle] = useState('');
    const [categories, setCategories] = useState('');
    const [locationState, setLocationState] = useState('');
    const [videoAsset, setVideoAsset] = useState(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [description,setDescription]=useState('');
    const userInfo=useSelector(state=>state.activeUser.user);
    const navigate=useNavigate();


    const uploadVideo = (e) => {
        setLoading(true)
        const videoFile = (e.target.files[0]);
        const storageRef = ref(storage, `Videos/${Date.now()}-${videoFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, videoFile);
        uploadTask.on('state_changed', (snapshot) => {
            const currentByte = (Number(snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            setProgress(currentByte)
        },
            (error) => {
                setError(error);
                setLoading(false);
                setProgress(0);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                        setVideoAsset(downloadURL);
                        setLoading(false)
                        setProgress(0);
                    })

            }

        )
    }
    const handleDelete=()=>{
        const deleteRef=ref(storage,videoAsset)
        deleteObject(deleteRef)
        .then(()=>{
            setVideoAsset(null)
        })
        .catch(error=>{
            console.log(error)
        })
    }

    const handleUploadDetails=async(e)=>{
        e.preventDefault();
        setLoading(true);
        const videoDetails={
            videoAdded:`${Date.now()}`,
            title,
            category:categories,
            location:locationState,
            videoUrl:videoAsset,
            description,
            userName:userInfo.userName,
            userImage:userInfo.userImage,
            userid:userInfo.userId,
            likes:[],
            dislikes:[],
            comments:[],
            createdAt:Timestamp.now().toDate(),
        }

        try{
            await addDoc(collection(db,`videos`),videoDetails);
            setLoading(false);
            toast.success('Video added successfully')
            navigate('/');
        }
        catch(error){
            console.log(error)
            toast.error('Something Went Wrong!!!!');
            setLoading(false);
        }
    }
    if (error) {
        return <h1 className="text-5xl font-bold"> OOOPPS!!!!!! Something Went WRONG !!!!!!!!</h1>
    }
    else {
        return (
            <div className="w-full md:w-5/6 lg:w-full  border-2 rounded p-4 lg:p-8 mt-10 lg:mt-15">
                <form onSubmit={handleUploadDetails}>
                    <div>
                        <input type="text" className=" w-full text-lg focus:outline-none focus:border-b-slate-500 lg:text-2xl border-b-2 border-b-slate-300 p-1 px-2 rounded" onChange={(e) => setTitle(e.target.value)} required placeholder="Title" />
                    </div>
                    <div className="grid grid-cols-2 gap-5 mt-5">
                        <select name="" id="" required value={categories} className=" text-lg w-full text-center focus:outline-none focus:border-b-slate-500 lg:text-2xl border-b-2 border-b-slate-300 rounded" onChange={(e) => setCategories(e.target.value)}>
                            <option value="" disabled>------------Select Category------------</option>
                            {category.map(catItem => <option value={catItem.name} key={catItem.id}>{catItem.name} </option>)}
                        </select>
                        <div>
                            <input type="text" className=" text-lg focus:outline-none focus:border-b-slate-500 lg:text-2xl border-b-2 border-b-slate-300 p-1 px-2 w-full rounded" onChange={(e) => setLocationState(e.target.value)} required placeholder={`Country`} />
                        </div>
                    </div>
                    <div className="w-full border border-dashed mt-5 h-32  md:h-52 lg:h-96 flex items-center justify-center">
                        <div className="h-full w-full flex items-center justify-center">
                            {!videoAsset ? (
                                <div className="w-full h-full flex justify-center items-center">
                                    {loading ? <>
                                        <div className="w-5/6 h-1/2">
                                            <progress className="progress progress-accent" value={progress} max="100"></progress>
                                            <span className=" w-1/6 block mx-auto h-1/2 loading loading-dots text-accent text-center mt-10"></span>
                                        </div>

                                    </>
                                        : <>
                                            <div className="h-full w-full grid justify-center items-center">
                                                <div className="w-fit mx-auto mt-5 md:mt-10"><IoCloudUpload size={40}></IoCloudUpload></div>
                                                <p className="text-lg md:text-xl lg:text-2xl -mt-10 md:-mt-24 lg:-mt-44">Upload here</p>
                                            </div>

                                        </>}

                                    {!loading && (
                                        <div className="lg:h-[50%] lg:w-[85%] h-[20%] w-[45%] md:h-[27%] md:w-[70%]  bg-red-500 absolute opacity-0">
                                            <input type='file' className=" bg-white h-full w-full cursor-pointer opacity-0 relative"  placeholder="" accept="video/mp4,video/xm4,video/*" required onChange={(e) => { uploadVideo(e) }} />
                                        </div>
                                    )}
                                </div>)
                                : <div className="w-full h-full">
                                    <video src={videoAsset} controls className="w-full h-full"></video>
                                    <div className="text-red-500 absolute top-[62%] left-[85%] text-xl md:text-3xl lg:text-4xl md:top-[41%] lg:top-[55%] md:left-[90%] cursor-pointer" onClick={handleDelete}><IoTrash></IoTrash></div>
                                </div>}
                        </div>
                    </div>
                    <div className="">
                        <textarea name="" id="" className="w-full h-32 md:h-44 lg:h-52 resize-none mt-5 border border-slate-300 text-lg lg:text-2xl focus:outline-none focus:border-slate-500 p-2 " placeholder="Description" onChange={(e)=>setDescription(e.target.value)}></textarea>
                    </div>
                    <div className="flex justify-center mt-5">
                        <button className="btn btn-accent w-1/3">Upload</button>
                    </div>
                </form>
            </div>
        );
    }
};

export default Create;