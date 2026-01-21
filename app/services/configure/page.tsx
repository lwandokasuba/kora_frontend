'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import FormBuilder from '@/components/form-builder/FormBuilder'
import { AppLayout } from '@/components/layout/AppLayout'

function ConfigureServiceContent() {
    const searchParams = useSearchParams()
    const formId = searchParams.get('id')

    return (
        <AppLayout showSidebar={true} showHeader={false}>
            <FormBuilder formId={formId || undefined} />
        </AppLayout>
    )
}

export default function ConfigureServicePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        }>
            <ConfigureServiceContent />
        </Suspense>
    )
}
