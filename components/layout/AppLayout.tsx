'use client'

import { AppSidebar } from './AppSidebar'
import { AppHeader } from './AppHeader'

interface AppLayoutProps {
    children: React.ReactNode
    showSidebar?: boolean
    showHeader?: boolean
}

export function AppLayout({ 
    children, 
    showSidebar = true, 
    showHeader = true 
}: AppLayoutProps) {
    return (
        <div className="flex h-screen overflow-hidden">
            {showSidebar && <AppSidebar />}
            <div className="flex flex-1 flex-col overflow-hidden">
                {showHeader && <AppHeader />}
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
