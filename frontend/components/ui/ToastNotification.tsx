"use client"

import { Bounce, ToastContainer } from "react-toastify"
import "react-toastify/ReactToastify.css"

export default function ToastNotification() {
  return (
    <ToastContainer
position="top-right"
autoClose={2500}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
transition={Bounce}
/>
  )
}
