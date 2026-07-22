"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { dashboardSidebar } from "@/constants"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

const Sidebar = () => {
    const pathname = usePathname()

    return (
        <div className="p-4 shadow-lg">
            <h2 className="font-semibold">Dashboard</h2>
            <Separator />
            <div className="flex flex-col gap-1 mt-2">
                {dashboardSidebar.map(item => (
                    <Link href={item.route} className="flex items-center gap-2" key={item.route}>
                        <Button
                            variant={pathname == item.route ? 'secondary' : 'ghost'}
                            className={cn('flex justify-start p-3 w-full cursor-pointer', pathname == item.route && "font-bold")}
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