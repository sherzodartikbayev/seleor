'use server'

import { axiosClient } from "@/http/axios"
import { actionClient } from "@/lib/safe-action"
import { emailSchema, loginSchema, registerSchema, verifySchema } from "@/lib/validation"
import { ReturnActionType } from "@/types"
import axios from "axios"

export const login = actionClient.schema(loginSchema).action<ReturnActionType>(async ({ parsedInput }) => {
    try {
        const { data } = await axiosClient.post('/api/auth/login', parsedInput)
        return JSON.parse(JSON.stringify(data))
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                failure: error.response?.data?.failure ?? "Something went wrong"
            }
        }

        return {
            failure: "Something went wrong"
        }
    }
})
export const register = actionClient.schema(registerSchema).action<ReturnActionType>(async ({ parsedInput }) => {
    const { data } = await axiosClient.post('/api/auth/register', parsedInput)
    return JSON.parse(JSON.stringify(data))
})

export const sendOtp = actionClient.schema(emailSchema).action<ReturnActionType>(async ({ parsedInput }) => {
    const { data } = await axiosClient.post('/api/otp/send', parsedInput)
    return JSON.parse(JSON.stringify(data))
})

export const verifyOtp = actionClient.schema(verifySchema).action<ReturnActionType>(async ({ parsedInput }) => {
    const { data } = await axiosClient.post('/api/otp/verify', parsedInput)
    return JSON.parse(JSON.stringify(data))
})
