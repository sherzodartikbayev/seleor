'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { adminSidebar } from '@/constants'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Sidebar = () => {
    const pathname = usePathname()

    return (
        <div className='p-4 shadow-lg'>
            <h1 className='font-semibold'>Admin</h1>
            <Separator />
            <div className='flex flex-col gap-1 mt-2'>
                {adminSidebar.map(item => (
                    <Link href={item.route} key={item.route}>
                        <Button
                            variant={pathname == item.route ? 'secondary' : 'ghost'}
                            className={cn('flex justify-start w-full p-4 cursor-pointer', pathname == item.route && 'font-bold')}
                        >
                            <item.icon />
                            <span>{item.name}</span>
                        </Button>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Sidebar