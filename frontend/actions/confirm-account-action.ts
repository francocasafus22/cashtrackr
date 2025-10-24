"use server"

import { ErrorSchema, SuccessSchema, TokenSchema } from "@/src/schemas";

type ActionStateType = {
    errors : string[]
    success: string
}

export async function confirmAccount(token: string, prevState: ActionStateType) {
    
    const confirmToken = TokenSchema.safeParse(token)
    if(!confirmToken.success){
        return{
            errors: confirmToken.error.issues.map(issue=>issue.message),
            success: ""
        }
    }
        
      // Confirmar la cuenta
    
      const url = `${process.env.API_URL}/auth/confirm-account`;
    
      const req = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: confirmToken.data
        }),
      });
    
      if(!req.ok){
        const error = ErrorSchema.parse(await req.json());
        return {
          errors: [error.error],
          success: "",
        };
      }
      
      const successMessage = SuccessSchema.parse(await req.json());
    

    return{
        errors: [],
        success: successMessage.message
    }
}