import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Features/authSlice";
import modalReducer from "../Features/modalSlice";

const store=configureStore({
    reducer:{
        activeUser:authReducer,
        modal:modalReducer,

    },
})

export default store;