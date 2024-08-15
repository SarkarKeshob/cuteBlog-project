import { createSlice } from "@reduxjs/toolkit";

export const modalSlice=createSlice({
    name:'modal',
    initialState:{
        openModal:false,
    },
    reducers:{
        setModalOpen:(state)=>{
            state.openModal=true;
        },
        setModalClose:(state)=>{
            state.openModal=false;
        }
    }
})

export const {setModalOpen,setModalClose}=modalSlice.actions;
export default modalSlice.reducer;