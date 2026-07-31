import { getTransactions } from '@/actions/user.action'
import Filter from '@/components/shared/filter'
import Pagination from '@/components/shared/pagination'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatPrice, getStatusText, getStatusVariant } from '@/lib/utils'
import { SearchParams } from '@/types'
import Image from 'next/image'
import { FC } from 'react'

interface Props {
    searchParams: SearchParams
}

const Page: FC<Props> = async (props) => {
    const searchParams = await props.searchParams

    const res = await getTransactions({
        searchQuery: `${searchParams.q || ''}`,
        filter: `${searchParams.filter || ''}`,
        page: `${searchParams.page || '1'} `
    })
    const transactions = res.data?.transactions
    const isNext = res.data?.isNext || false

    return (
        <>
            <div className='flex justify-between items-center gap-5 w-full'>
                <h1 className='text-xl font-bold'>Payments</h1>
                <Filter />
            </div>

            <Separator className='my-3' />

            <Table className='text-sm'>
                {transactions && transactions.length > 0 && <TableCaption>A list of your recent orders.</TableCaption>}
                <TableHeader>
                    <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className='text-right'>Price</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions && transactions.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4}>No transactions found.</TableCell>
                        </TableRow>
                    )}
                    {transactions && transactions.map(transaction => (
                        <TableRow key={transaction._id}>
                            <TableCell>
                                <Image
                                    src={transaction.product.image}
                                    alt={transaction.product.title}
                                    width={50}
                                    height={50}
                                />
                            </TableCell>
                            <TableCell>{transaction.product.title}</TableCell>
                            <TableCell>
                                <Badge className='capitalize' variant='secondary'>
                                    {transaction.provider}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={getStatusVariant(transaction.state)}>
                                    {getStatusText(transaction.state)}
                                </Badge></TableCell>
                            <TableCell className='text-right'>{formatPrice(transaction.amount)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Pagination isNext={isNext} pageNumber={searchParams?.page ? +searchParams.page : 1} />
        </>
    )
}

export default Page