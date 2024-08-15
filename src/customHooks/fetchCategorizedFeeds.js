import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../Firebase/firebase.config";


 const useFetchCategorizedFeeds=(toSearch,searchBy)=>{
    const [data,setData]=useState([]);
    const [isLoading,setIsLoading]=useState(true);
    const [isError,setIsError]=useState('');
    
    useEffect(()=>{
        const getData=async()=>{
            setIsError('');
            try{
                const docRef= collection(db,'videos');
                console.log(docRef);
                const q=query(docRef,where(toSearch,'==',searchBy),orderBy('createdAt',"asc"));
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

    },[toSearch,searchBy]);
    const returnObject={data,isError,isLoading};
    return returnObject;
}

export default useFetchCategorizedFeeds;