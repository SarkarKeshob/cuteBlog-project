import ReactDOM from 'react-dom'
const Loader = () => {
    return ReactDOM.createPortal(
        <div className='bg-slate-600 bg-opacity-60 z-50 absolute top-0 left-0 right-0 min-h-full'>
            <div className="w-1/5 mx-auto mt-48 sticky top-0">
                <div className="loading loading-spinner  text-warning w-full"></div>

            </div>

        </div>
        ,document.getElementById('loader')
    );
};

export default Loader;