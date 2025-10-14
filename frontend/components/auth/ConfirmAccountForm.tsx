"use client"
import { startTransition, useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {PinInput, PinInputField} from "@chakra-ui/pin-input"
import Spinner from "../ui/Spinner"
import { toast } from "react-toastify"
import { confirmAccount } from "@/actions/confirm-account-action"

export default function ConfirmAccountForm() {

    const router = useRouter();

    const [isComplete, setIsComplete] = useState(false)

    const [token, setToken] = useState("")

    const confirmAccountWithToken = confirmAccount.bind(null, token);

    const [state, dispatch, isPending] = useActionState(confirmAccountWithToken, {
        errors: [],
        success: ""
    })

    useEffect(()=>{

        if(isComplete){
            startTransition(()=>{
                dispatch()
            })           
        }
     
    }, [isComplete])

    useEffect(()=>{
      
        state.success ?
            toast.success(state.success, {onClose: ()=>{router.push("/auth/login")}}) : 
            state.errors.forEach(error=>{ toast.error(error)})
        
    }, [state])


    const handleChange = ( token: string ) => {
        setToken(token)   
        setIsComplete(false)  
    }
   
    const handleComplete = () => {
        setIsComplete(true)

    }
  return (
    <>
    <div className="flex justify-center gap-5 my-10">
        <PinInput
        value={token}
        onChange={handleChange}
        onComplete={handleComplete}
        isDisabled={isPending}
        >
            <PinInputField className="h-10 w-10 border-1 border-gray-400 placeholder-background rounded-lg text-center"/>
            <PinInputField className="h-10 w-10 border-1 border-gray-400 placeholder-background rounded-lg text-center"/>
            <PinInputField className="h-10 w-10 border-1 border-gray-400 placeholder-background rounded-lg text-center"/>
            <PinInputField className="h-10 w-10 border-1 border-gray-400 placeholder-background rounded-lg text-center"/>
            <PinInputField className="h-10 w-10 border-1 border-gray-400 placeholder-background rounded-lg text-center"/>
            <PinInputField className="h-10 w-10 border-1 border-gray-400 placeholder-background rounded-lg text-center"/>
        </PinInput>
    </div>
    
    
    {isPending && <Spinner color="text-orange-400"/>}
    </>
  )
}
