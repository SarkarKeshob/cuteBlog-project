import { FaGoogle } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { signInUser, } from "../../Redux/Features/authSlice";
import { setModalClose } from "../../Redux/Features/modalSlice";

const LoginModal = () => {
    const dispatch = useDispatch();
    const modalCondition = useSelector(state => state.modal.openModal);
    const handleSignIn = () => {
        dispatch(setModalClose())
        dispatch(signInUser());
    }
    return (
        <div>
            <dialog className="modal p-4 bg-slate-100" open={modalCondition}>
                <div className="modal-box w-fit mx-auto">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={()=>dispatch(setModalClose())}>✕</button>
                    <h3 className="text-2xl font bold my-4">Please Login To Add content</h3>
                    <button className="btn btn-success" onClick={handleSignIn}>Login With Google <FaGoogle size={20} color="yellow"></FaGoogle> </button>

                </div>
            </dialog>
        </div>
    );
};

export default LoginModal;