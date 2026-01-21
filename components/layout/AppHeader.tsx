'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Moon, Sun, LogOut, User } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function AppHeader() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleSignOut = async () => {
        await signOut({ redirect: false })
        router.push('/login')
        router.refresh()
    }

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold">Dashboard</h2>
                </div>
                <div className="flex items-center gap-2">
                    {mounted ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="h-9 w-9"
                        >
                            {theme === 'dark' ? (
                                <Sun className="h-4 w-4" />
                            ) : (
                                <Moon className="h-4 w-4" />
                            )}
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    ) : (
                        <div className="h-9 w-9" /> // Placeholder to prevent layout shift
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSignOut}
                        className="gap-2"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </div>
        </header>
    )
}
