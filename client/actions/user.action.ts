'use server'

import { axiosClient } from "@/http/axios"
import { authOptions } from "@/lib/auth-options"
import { generateToken } from "@/lib/generate-token"
import { actionClient } from "@/lib/safe-action"
import { idSchema, searchParamsSchema } from "@/lib/validation"
import { ReturnActionType } from "@/types"
import axios from "axios"
import { getServerSession } from "next-auth"

export const getProducts = actionClient.schema(searchParamsSchema).action<ReturnActionType>(async () => {
    try {
        const { data } = await axiosClient.get('/api/user/products')
        return JSON.parse(JSON.stringify(data))
    } catch (error) {
        console.log(error);
    }
})

export const getProduct = actionClient.schema(idSchema).action<ReturnActionType>(async ({ parsedInput }) => {
    try {
        const { data } = await axiosClient.get(`/api/user/product/${parsedInput.id}`)
        return JSON.parse(JSON.stringify(data))
    } catch (error) {
        console.log(error);
    }
})

export const addFavorite = actionClient.schema(idSchema).action<ReturnActionType>(async ({ parsedInput }) => {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.currentUser) return { failure: 'You must be logged in to add a favorite' }
        const token = await generateToken(session?.currentUser?._id)
        const { data } = await axiosClient.post('/api/user/favorite', { productId: parsedInput.id }, {
            headers: { Authorization: `Bearer ${token}` }
        })
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