'use client'

import { updateOrder } from '@/actions/admin.action'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useAction from '@/hooks/use-action'
import { IOrder } from '@/types'
import { EllipsisVertical } from 'lucide-react'
import { FC, useState } from 'react'
import { toast } from 'sonner'

interface Props {
    order: IOrder
}

const OrderActions: FC<Props> = ({ order }) => {
    const [open, setOpen] = useState(false)
    const { isLoading, setIsLoading, onError } = useAction()

    const onUpdateStatus = async (status: string) => {
        setIsLoading(true)
        const res = await updateOrder({ id: order._id, status })
        if (res?.serverError || res?.validationErrors || !res?.data) {
            return onError('Something went wrong')
        }
        if (res.data.failure) {
            return onError(res.data.failure)
        }
        toast('Order updated successfully')
        setIsLoading(false)
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <Button size={'icon'} className='size-6' variant={'outline'}>
                    <EllipsisVertical />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-40 p-1' side='right'>
                <div className='flex flex-col space-y-0'>
                    <Button
                        size={'sm'}
                        className='justify-start'
                        onClick={() => onUpdateStatus('Order confirmed')}
                        disabled={isLoading || order.status === 'Order confirmed'}
                    >
                        1. Confirm order
                    </Button>
                    <Button
                        size={'sm'}
                        className='justify-start'
                        onClick={() => onUpdateStatus('Order started to delivery')}
                        disabled={isLoading || order.status === 'Order started to delivery'}
                    >
                        2. Start delivery
                    </Button>
                    <Button
                        size={'sm'}
                        className='justify-start'
                        onClick={() => onUpdateStatus('Delivery in progress')}
                        disabled={isLoading || order.status === 'Delivery in progress'}
                    >
                        3. Delivery in progress
                    </Button>
                    <Button
                        size={'sm'}
                        className='justify-start'
                        onClick={() => onUpdateStatus('Delivery completed')}
                        disabled={isLoading || order.status === "Delivery completed"}
                    >
                        4. Complete delivery
                    </Button>
                    <Button
                        className='justify-start'
                        onClick={() => onUpdateStatus('Order delivered')}
                        disabled={isLoading || order.status === "Order delivered"}
                        size={'sm'}
                    >
                        5. Mark as delivered
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default OrderActions