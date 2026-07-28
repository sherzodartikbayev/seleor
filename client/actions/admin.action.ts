'use server'

import { axiosClient } from '@/http/axios';
import { authOptions } from '@/lib/auth-options';
import { generateToken } from '@/lib/generate-token';
import { actionClient } from '@/lib/safe-action';
import { idSchema, productSchema, searchParamsSchema, updateProductSchema } from '@/lib/validation';
import { ReturnActionType } from '@/types';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { UTApi } from 'uploadthing/server'

const utapi = new UTApi({});

export const getAdminProducts = actionClient.schema(searchParamsSchema).action<ReturnActionType>(async ({ parsedInput }) => {
    try {
        const session = await getServerSession(authOptions)
        const token = await generateToken(session?.currentUser?._id)
        const { data } = await axiosClient.get('/api/admin/products',
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

export const getCustomers = actionClient.schema(searchParamsSchema).action<ReturnActionType>(async ({ parsedInput }) => {
    try {
        const session = await getServerSession(authOptions)
        const token = await generateToken(session?.currentUser?._id)
        const { data } = await axiosClient.get('/api/admin/customers', {
            headers: { Authorization: `Bearer ${token}` },
            params: parsedInput
        })
        return JSON.parse(JSON.stringify(data))
    } catch (error) {
        console.log(error)
    }
})

export const getOrders = actionClient.schema(searchParamsSchema).action<ReturnActionType>(async ({ parsedInput }) => {
    try {
        const session = await getServerSession(authOptions)
        const token = await generateToken(session?.currentUser?._id)
        const { data } = await axiosClient.get('/api/admin/orders', {
            headers: { Authorization: `Bearer ${token}` },
            params: parsedInput
        })
        return JSON.parse(JSON.stringify(data))
    } catch (error) {
        console.log(error)
    }
})

export const getTransactions = actionClient.schema(searchParamsSchema).action<ReturnActionType>(async ({ parsedInput }) => {
    try {
        const session = await getServerSession(authOptions)
        const token = await generateToken(session?.currentUser?._id)
        const { data } = await axiosClient.get('/api/admin/transactions', {
            headers: { Authorization: `Bearer ${token}` },
            params: parsedInput
        })
        return JSON.parse(JSON.stringify(data))
    } catch (error) {
        console.log(error)
    }
})

export const createProduct = actionClient.schema(productSchema).action<ReturnActionType>(async ({ parsedInput }) => {
    try {
        const session = await getServerSession(authOptions)
        const token = await generateToken(session?.currentUser?._id)
        const { data } = await axiosClient.post('/api/admin/product', {
            ...parsedInput, price: parseFloat(parsedInput.price)
        }, { headers: { Authorization: `Bearer ${token}` } })
        revalidatePath('/admin/products')
        return JSON.parse(JSON.stringify(data))
    } catch (error) {
        console.log(error);
    }
})

export const updateProducts = actionClient.schema(updateProductSchema).action<ReturnActionType>(async ({ parsedInput }) => {
    try {
        const session = await getServerSession(authOptions)
        const token = await generateToken(session?.currentUser?._id)
        const { data } = await axiosClient.put(`/api/admin/product/${parsedInput.id}`, parsedInput, { headers: { Authorization: `Bearer ${token}` } })
        revalidatePath('/admin/products')
        return JSON.parse(JSON.stringify(data))
    } catch (error) {
        console.log(error);
    }
})

export const deleteProduct = actionClient.schema(idSchema).action<ReturnActionType>(async ({ parsedInput }) => {
    try {
        const session = await getServerSession(authOptions)
        const token = await generateToken(session?.currentUser?._id)
        const { data } = await axiosClient.delete(`/api/admin/product/${parsedInput.id}`, { headers: { Authorization: `Bearer ${token}` } })
        revalidatePath('/admin/products')
        return JSON.parse(JSON.stringify(data))
    } catch (error) {
        console.log(error);
    }
})

export const deleteFile = async (key: string) => {
    utapi.deleteFiles(key)
}