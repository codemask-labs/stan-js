import React, { useRef } from 'react'

export const AnimateRerender: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const isMounted = useRef(false)

    if (!isMounted.current) {
        isMounted.current = true
    } else {
        containerRef.current?.animate([
            { opacity: 0 },
            { opacity: 1 },
            { opacity: 0 },
        ], { duration: 300, pseudoElement: '::after' })
    }

    return (
        <div
            ref={containerRef}
            className="container"
        >
            {children}
        </div>
    )
}
