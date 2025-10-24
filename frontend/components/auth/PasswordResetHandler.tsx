"use client"
import { useState } from "react"
import ValidateTokenForm from "./ValidateTokenForm"
import ResetPasswordForm from "./ResetPasswordForm"

export default function PasswordResetHandler() {

    const [token, setToken] = useState("")
    const [isValidToken, SetIsValidToken] = useState(false)

  return (
    <>
        {!isValidToken ? <ValidateTokenForm token={token} setToken={setToken} setIsValidPassword={SetIsValidToken}/> : <ResetPasswordForm token={token}/>}
    </>
  )
}
