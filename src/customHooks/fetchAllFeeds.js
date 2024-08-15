import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../Firebase/firebase.config";

const useFetchAllFeeds=(collectionName)=>{
    const [data,setData]=useState([]);
    const [isloading,setIsLoading]=useState(true);
    const [isError,setIsError]=useState('');
    

    useEffect(()=>{
        const getData=async()=>{
            setIsError('');
            try{
                const docRef= collection(db,collectionName);
                const q=query(docRef,orderBy('createdAt','asc'));
                onSnapshot(q,(snapshot)=>{
                    const allData=snapshot.docs.map(doc=>({
                        id:doc.id,
                        ...doc.data()
                    }))
                    
                    setData(allData);
                    setIsLoading(false);
                })
            }
            catch(error){
                console.log(error);
                setIsLoading(false);
                setIsError('Something Went Wrong');
            }
        }
        getData();

    },[collectionName]);
    const returnObject={data,isError,isloading};
    return returnObject;
}

export default useFetchAllFeeds;