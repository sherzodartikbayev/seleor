'use server'

import { axiosClient } from "@/http/axios"
import { authOptions } from "@/lib/auth-options"
import { generateToken } from "@/lib/generate-token"
import { actionClient } from "@/lib/safe-action"
import { idSchema, passwordSchema, searchParamsSchema, updateUserSchema } from "@/lib/validation"
import { ReturnActionType } from "@/types"
import axios from "axios"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"

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

export const getOrders = actionClient.schema(searchParamsSchema).action<ReturnActionType>(async ({ parsedInput }) => {
    try {
        const session = await getServerSession(authOptions)
        const token = await generateToken(session?.currentUser?._id)
        const { data } = await axiosClient.get('/api/user/orders',
            {
                headers: { Authorization: `Bearer ${token}` },
                params: parsedInput
            }
        )
        return JSON.parse(JSON.stringify(data))
    } catch (error) {
        console.log(error);
    }
})

export const getTransactions = actionClient.schema(searchParamsSchema).action<ReturnActionType>(async ({ parsedInput }) => {
    try {
        const session = await getServerSession(authOptions)
        const token = await generateToken(session?.currentUser?._id)
        const { data } = await axiosClient.get('/api/user/transactions',
            {
                headers: { Authorization: `Bearer ${token}` },
                params: parsedInput
            }
        )
        return JSON.parse(JSON.stringify(data))
    } catch (error) {
        console.log(error);
    }
})

export const getFavorites = actionClient.schema(searchParamsSchema).action<ReturnActionType>(async ({ parsedInput }) => {
    try {
        const session = await getServerSession(authOptions)
        const token = await generateToken(session?.currentUser?._id)
        const { data } = await axiosClient.get('/api/user/favorites',
            {
                headers: { Authorization: `Bearer ${token}` },
                params: parsedInput
            }
        )
        return JSON.parse(JSON.stringify(data))
    } catch (error) {
        console.log(error);
    }
})

export const getStatistics = actionClient.action<ReturnActionType>(async () => {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.currentUser) return { failure: 'You must be logged in to update your profile' }
        const token = await generateToken(session?.currentUser?._id)
        const { data } = await axiosClient.get('/api/user/statistics', {
            headers: { Authorization: `Bearer ${token}` },
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

export const updateUser = actionClient.schema(updateUserSchema).action<ReturnActionType>(async ({ parsedInput }) => {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.currentUser) return { failure: 'You must be logged in to update your profile' }
        const token = await generateToken(session?.currentUser?._id)
        const { data } = await axiosClient.put('/api/user/profile', parsedInput, {
            headers: { Authorization: `Bearer ${token}` },
        })
        revalidatePath('/dashboard')
        return JSON.parse(JSON.stringify(data))
    } catch (error) {
        console.log(error);
    }
})

export const updatePassword = actionClient.schema(passwordSchema).action<ReturnActionType>(async ({ parsedInput }) => {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.currentUser) return { failure: 'You must be logged in to update your profile' }
        const token = await generateToken(session?.currentUser?._id)
        const { data } = await axiosClient.put('/api/user/password', parsedInput, {
            headers: { Authorization: `Bearer ${token}` },
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

export const deleteFavorite = actionClient.schema(idSchema).action<ReturnActionType>(async ({ parsedInput }) => {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.currentUser) return { failure: 'You must be logged in to update your profile' }
        const token = await generateToken(session?.currentUser?._id)
        const { data } = await axiosClient.delete(`/api/user/favorite/${parsedInput.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        revalidatePath('/dashboard/watch-list')
        return JSON.parse(JSON.stringify(data))
    } catch (error) {
        console.log(error);
    }
})