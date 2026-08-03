'use client'

import { ChildProps } from '@/types'
import { SessionProvider as Session } from 'next-auth/react'
import { FC } from 'react'
import NoSSR from 'react-no-ssr'

const SessionProvider: FC<ChildProps> = ({ children }) => {
    return (
        <NoSSR>
            <Session>{children}</Session>
        </NoSSR>
    )
}

export default SessionProvider