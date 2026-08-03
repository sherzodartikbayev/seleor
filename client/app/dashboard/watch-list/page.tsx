import { getFavorites } from '@/actions/user.action'
import WatchListCard from '@/components/card/watch-list.card'
import Filter from '@/components/shared/filter'
import Pagination from '@/components/shared/pagination'
import { Separator } from '@/components/ui/separator'
import { SearchParams } from '@/types'
import { FC } from 'react'

interface Props {
    searchParams: SearchParams
}

const Page: FC<Props> = async (props) => {
    const searchParams = props.searchParams

    const res = await getFavorites({
        searchQuery: `${searchParams.q || ''}`,
        filter: `${searchParams.filter || ''}`,
        category: `${searchParams.category || ''}`,
        page: `${searchParams.page || '1'} `
    })
    const products = res.data?.products
    const isNext = res.data?.isNext || false

    return (
        <>
            <h1 className='text-xl font-bold'>Watch list</h1>

            <Separator className='my-3' />

            <Filter showCategory />

            {products && products.length === 0 && (
                <div className="text-center mt-3">
                    No products found.
                </div>
            )}

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-3'>
                {products && products.map(product => (
                    <WatchListCard key={product._id} product={product} />
                ))}
            </div>

            <Pagination isNext={isNext} pageNumber={searchParams?.page ? +searchParams.page : 1} />
        </>
    )
}

export default Page