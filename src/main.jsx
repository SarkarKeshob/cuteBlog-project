import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './Routes/Routes.jsx'
import { Provider } from 'react-redux'
import store from './Redux/Store/Store.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>,
  </Provider>
)
