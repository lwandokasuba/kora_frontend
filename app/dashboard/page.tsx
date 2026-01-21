
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground text-lg">Manage your services and configurations.</p>
            </div>

            <div className="grid gap-4">
                <Link href="/services/configure">
                    <Button size="lg" className="h-16 text-lg px-8">
                        Configure a Service
                    </Button>
                </Link>
            </div>
        </div>
    )
}
