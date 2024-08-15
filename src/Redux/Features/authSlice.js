import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../../Firebase/firebase.config";

// Sign in 
export const signInUser=createAsyncThunk('activeUser/signInUser',async()=>{
    try{
        const provider=new GoogleAuthProvider();
         const result=await signInWithPopup(auth,provider);
         const userCred=result.user;
         const userData={
            userName:userCred.displayName,
            userEmail:userCred.email,
            userId:userCred.uid,
            userImage:userCred.photoURL,
            isEmailVeridied:userCred.emailVerified
        }
         return userData;
    }
    catch(error){
        return(error.message);
    }
})

// Listen if the user is logged in 
export const trackUser=createAsyncThunk('activeUser/trackUser',async()=>{
    return new Promise((resolve,reject)=>{
        const unSubscribe = onAuthStateChanged(auth,(userCred)=>{
        console.log(userCred)
            if(userCred){
                const userData={
                    userName:userCred.displayName,
                    userEmail:userCred.email,
                    userId:userCred.uid,
                    userImage:userCred.photoURL,
                    isEmailVeridied:userCred.emailVerified
                }
                console.log(userData)
                resolve(userData)
            }
            else{
                console.log(userCred)
                reject({});
            }
        })

        return()=>{
            unSubscribe();
        }
    })
});

export const logOutUser=createAsyncThunk('activeUser/logOutUser',async()=>{
    try{
        await signOut(auth)
    }
    catch(error){
        console.log(error)
    }
})

const initialState={
    user:{
        userName:'',
        userEmail:'',
        userId:'',
        userImage:'',
        EmailVerified:false,
    },
    isLoading:false,
}
export const authSlice=createSlice({
    name:'activeUser',
    initialState,
    extraReducers:(builder)=>{
        builder.addCase(signInUser.pending,(state)=>{
            state.isLoading=true;
        })

        builder.addCase(signInUser.fulfilled,(state,action)=>{
            state.user=action.payload;
            state.isLoading=false;

        })

        builder.addCase(signInUser.rejected,(state)=>{
            state.user=initialState;
            state.isLoading=false;
        })

        builder.addCase(trackUser.pending,(state)=>{
            state.isLoading=true;
        })
        builder.addCase(trackUser.fulfilled,(state,action)=>{
            console.log('Fulfilled payLoad',action.payload)
            state.user=action.payload;
            state.isLoading=false;
        })
        builder.addCase(trackUser.rejected,(state)=>{
            state.user=initialState
            state.isLoading=false;
        })
        builder.addCase(logOutUser.pending,(state)=>{
            state.isLoading=true;
        })
        builder.addCase(logOutUser.fulfilled,(state)=>{
            state.user=initialState;
            state.isLoading=false;
        })
        builder.addCase(logOutUser.rejected,(state)=>{
            state.isLoading=false;
        })
    },

})

export default authSlice.reducer;