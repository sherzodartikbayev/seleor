'use client'

import { Search } from 'lucide-react'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { formUrlQuery, removeUrlQuery } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { debounce } from 'lodash'
import { useEffect, useMemo } from 'react'
import { categories } from '@/constants'

const Filter = () => {
    const searchParams = useSearchParams()
    const router = useRouter()

    const onFilterChange = (value: string | null) => {
        if (!value) return;
        const newUrl = formUrlQuery({ key: 'filter', params: searchParams.toString(), value })
        router.push(newUrl, { scroll: false })
    }

    const onCategoryChange = (value: string | null) => {
        if (!value) return;
        const newUrl = formUrlQuery({ key: 'category', params: searchParams.toString(), value })
        router.push(newUrl, { scroll: false })
    }

    const debouncedSearch = useMemo(
        () =>
            debounce((value: string, currentParams: string) => {
                if (value === '') {
                    const newUrl = removeUrlQuery({ key: 'q', params: currentParams })
                    router.push(newUrl, { scroll: false })
                } else {
                    const newUrl = formUrlQuery({ key: 'q', params: currentParams, value })
                    router.push(newUrl, { scroll: false })
                }
            }, 300),
        [router]
    )

    useEffect(() => {
        return () => {
            debouncedSearch.cancel()
        }
    }, [debouncedSearch])

    const onInputSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(e.target.value, searchParams.toString())
    }

    return (
        <div className='gap-1 max-md:w-full grid grid-cols-3'>
            <div className='flex items-center bg-secondary max-md:w-1/2 border'>
                <Input
                    placeholder='Qidirish'
                    className='text-xs border-none no-focus'
                    onChange={onInputSearch}
                    defaultValue={searchParams.get('q') || ''}
                />
                <Search className='mr-2 cursor-pointer text-muted-foreground' />
            </div>

            <Select onValueChange={onFilterChange} defaultValue={searchParams.get('filter') || undefined}>
                <SelectTrigger className='bg-secondary text-xs max-md:w-1/2 w-full'>
                    <SelectValue placeholder='Select filter' className='text-muted-foreground' />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value='newest'>Newest</SelectItem>
                    <SelectItem value='oldest'>Oldest</SelectItem>
                </SelectContent>
            </Select>

            <Select onValueChange={onCategoryChange} defaultValue={searchParams.get('category') || undefined}>
                <SelectTrigger className='bg-secondary text-xs max-md:w-1/2 w-full'>
                    <SelectValue placeholder='Select category' className='text-muted-foreground' />
                </SelectTrigger>
                <SelectContent>
                    {categories.map(category => (
                        <SelectItem value={category} key={category}>
                            {category}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export default Filter