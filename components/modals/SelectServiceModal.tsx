'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useServices } from '@/hooks/Services'
import { useFormsByService } from '@/hooks/Forms'
import { useFormFieldsByForm } from '@/hooks/FormFields'
import { useFields } from '@/hooks/Fields'
import { useCollectionItems } from '@/hooks/CollectionItems'
import { useCreateSubmission } from '@/hooks/Submissions'
import { useCheckReservedName } from '@/hooks/ReservedNames'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'

interface SelectServiceModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SelectServiceModal({ open, onOpenChange }: SelectServiceModalProps) {
    const [serviceId, setServiceId] = useState('')
    const [formData, setFormData] = useState<Record<number, string>>({})
    const [reservedNameErrors, setReservedNameErrors] = useState<Record<number, string>>({})
    const [checkingFields, setCheckingFields] = useState<Record<number, boolean>>({})
    const [showSuccess, setShowSuccess] = useState(false)
    const [createdCaseId, setCreatedCaseId] = useState<number | null>(null)
    const validationTimerRef = useRef<Record<number, NodeJS.Timeout>>({})

    const { data: services = [] } = useServices()
    const { data: forms = [] } = useFormsByService(serviceId ? Number(serviceId) : undefined)
    const selectedForm = forms[0]
    const selectedService = services.find(s => s.id === Number(serviceId))
    const { data: formFields = [] } = useFormFieldsByForm(selectedForm?.id)
    const { data: fields = [] } = useFields()
    const { data: collectionItems = [] } = useCollectionItems()
    const createSubmission = useCreateSubmission()
    const { mutate: checkName } = useCheckReservedName()

    const resetModal = () => {
        setServiceId('')
        setFormData({})
        setReservedNameErrors({})
        setCheckingFields({})
        setShowSuccess(false)
        setCreatedCaseId(null)
        // Clear all timers
        Object.values(validationTimerRef.current).forEach(timer => clearTimeout(timer))
        validationTimerRef.current = {}
    }

    const handleSubmit = async () => {
        // Validate required fields
        const requiredFields = formFields.filter(ff => {
            const field = fields.find(f => f.id === ff.field_id)
            return field?.status === true
        })

        const missingFields = requiredFields.filter(ff => !formData[ff.id]?.trim())
        
        if (missingFields.length > 0) {
            const field = fields.find(f => f.id === missingFields[0].field_id)
            toast.error(`${missingFields[0].field_name || field?.label} is required`)
            return
        }

        if (Object.keys(reservedNameErrors).length > 0) {
            toast.error('Please fix the validation errors before submitting.')
            return
        }

        try {
            const formAnswers = Object.entries(formData)
                .filter(([_, value]) => value)
                .map(([fieldId, value]) => ({
                    form_field_id: Number(fieldId),
                    answer: value
                }))

            const result = await createSubmission.mutateAsync({
                services_id: Number(serviceId),
                form_id: selectedForm?.id,
                created_by: 1,
                formAnswers
            })

            setCreatedCaseId(result.id)
            setShowSuccess(true)
        } catch (error) {
            toast.error('Failed to create case. Please try again.')
        }
    }

    const validateReservedName = (fieldId: number, name: string) => {
        if (validationTimerRef.current[fieldId]) {
            clearTimeout(validationTimerRef.current[fieldId])
        }

        if (!name) {
            setReservedNameErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[fieldId]
                return newErrors
            })
            setCheckingFields(prev => ({ ...prev, [fieldId]: false }))
            return
        }

        setCheckingFields(prev => ({ ...prev, [fieldId]: true }))
        setReservedNameErrors(prev => {
            const newErrors = { ...prev }
            delete newErrors[fieldId]
            return newErrors
        })

        validationTimerRef.current[fieldId] = setTimeout(() => {
            checkName({ name }, {
                onSuccess: (data) => {
                    setCheckingFields(prev => ({ ...prev, [fieldId]: false }))
                    if (data && data.length > 0) {
                        setReservedNameErrors(prev => ({ ...prev, [fieldId]: 'Name is unavailable' }))
                    } else {
                        setReservedNameErrors(prev => {
                            const newErrors = { ...prev }
                            delete newErrors[fieldId]
                            return newErrors
                        })
                    }
                },
                onError: () => {
                    setCheckingFields(prev => ({ ...prev, [fieldId]: false }))
                }
            })
        }, 500)
    }

    const renderField = (formField: any) => {
        const field = fields.find(f => f.id === formField.field_id)
        if (!field) return null

        const columnSpan = formField.field_span || 12
        const colSpanClass: Record<number, string> = {
            12: "col-span-12",
            6: "col-span-12 md:col-span-6",
            4: "col-span-12 md:col-span-4",
            3: "col-span-12 md:col-span-3",
        }
        const spanClass = colSpanClass[columnSpan] || "col-span-12"

        const fieldOptions = field.collection_id
            ? collectionItems.filter(item => item.collection_id === field.collection_id)
            : []

        const isRequired = field.status === true
        const isChecking = checkingFields[formField.id]
        const error = reservedNameErrors[formField.id]

        return (
            <div key={formField.id} className={spanClass}>
                <div className="space-y-2">
                    <Label className={cn(
                        "flex items-center gap-2",
                        formField.validation === 'validate_reserved_name' && error ? "text-red-500" : ""
                    )}>
                        {formField.field_name || field.label}
                        {isRequired && <span className="text-red-500 ml-1">*</span>}
                        {formField.validation === 'validate_reserved_name' && isChecking && (
                            <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                        )}
                    </Label>

                    {field.data_type_id === 1 && (
                        <div>
                            <Input
                                value={formData[formField.id] || ''}
                                className={cn(
                                    formField.validation === 'validate_reserved_name' && error ? "border-red-500 focus-visible:ring-red-500" : ""
                                )}
                                onChange={(e) => {
                                    const value = e.target.value
                                    setFormData({ ...formData, [formField.id]: value })

                                    if (formField?.validation === 'validate_reserved_name') {
                                        validateReservedName(formField.id, value)
                                    }
                                }}
                            />
                            {formField.validation === 'validate_reserved_name' && error && (
                                <p className="text-xs text-red-500 mt-1">{error}</p>
                            )}
                        </div>
                    )}

                    {field.data_type_id === 2 && (
                        <Input
                            type="number"
                            value={formData[formField.id] || ''}
                            onChange={(e) => setFormData({ ...formData, [formField.id]: e.target.value })}
                        />
                    )}

                    {field.data_type_id === 3 && (
                        <Input
                            type="date"
                            value={formData[formField.id] || ''}
                            onChange={(e) => setFormData({ ...formData, [formField.id]: e.target.value })}
                        />
                    )}

                    {field.data_type_id === 5 && (
                        <Select
                            value={formData[formField.id] || ''}
                            onValueChange={(v) => setFormData({ ...formData, [formField.id]: v })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                {fieldOptions.map(opt => (
                                    <SelectItem key={opt.id} value={opt.collection_item || ''}>
                                        {opt.collection_item}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
            </div>
        )
    }

    return (
        <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) resetModal() }}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
                {!serviceId ? (
                    <div className="p-6">
                        <DialogHeader>
                            <DialogTitle className="text-2xl">Create Case</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                            <div>
                                <Label>Select Service *</Label>
                                <Select value={serviceId} onValueChange={setServiceId}>
                                    <SelectTrigger className="mt-2">
                                        <SelectValue placeholder="Choose a service" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {services.map(service => (
                                            <SelectItem key={service.id} value={String(service.id)}>
                                                {service.service_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                ) : showSuccess ? (
                    <div className="py-4">
                        <div className="text-center space-y-6">
                            <div className="flex justify-center">
                                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                                    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <h2 className="text-2xl font-semibold">Your Request has been successfully submitted!</h2>
                            <p className="text-sm text-gray-600">
                                Case ID: <span className="font-mono font-semibold">#{createdCaseId}</span>
                            </p>
                            <div className="border-t pt-6 text-left">
                                <h3 className="font-semibold mb-4">Next Steps</h3>
                                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                                    <li>Proceed to payment to complete your application</li>
                                    <li>You will receive a confirmation email once payment is processed</li>
                                    <li>Your application will be reviewed within 3-5 business days</li>
                                </ol>
                            </div>
                            <Button className="w-full bg-[#8B6F47] hover:bg-[#6F5838]" onClick={() => { onOpenChange(false); resetModal() }}>
                                Close
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-8">
                        <div className="border-2 border-stone-900 p-8">
                            <div className="text-right text-xs mb-4">
                                <div className="font-bold">{selectedForm?.id === 1 ? 'Form 1' : selectedForm?.id === 3 ? 'Form 3' : selectedForm?.form_name}</div>
                                <div className="underline">(Regulation 2)</div>
                                <div className="text-xs italic">(In typescript and completed in duplicate)</div>
                            </div>

                            <div className="flex justify-center mb-4">
                                <Image src="/pacra-logo.webp" alt="PACRA" width={80} height={80} />
                            </div>

                            <h1 className="text-center font-bold text-sm mb-3">
                                THE PATENTS AND COMPANIES REGISTRATION AGENCY
                            </h1>

                            <div className="text-center mb-6 text-xs">
                                <div className="font-bold">The Companies Act, 2017</div>
                                <div className="font-bold">(Act No. 10 of 2017)</div>
                                <div className="my-1">___________</div>
                                <div className="font-bold">The Companies (Prescribed Forms) Regulations, 2018</div>
                                <div className="italic">(Section 12, 13 and 94)</div>
                            </div>

                            {formFields.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    Loading form fields...
                                </div>
                            ) : (
                                <table className="w-full border-collapse border border-stone-900 text-xs">
                                    <thead>
                                        <tr style={{backgroundColor: '#ffe598'}}>
                                            <th colSpan={3} className="border border-stone-900 p-2 font-bold text-center uppercase">
                                                {selectedService?.service_name || 'APPLICATION FORM'}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formFields.map((formField) => {
                                            const field = fields.find(f => f.id === formField.field_id)
                                            if (!field) return null

                                            const fieldOptions = field.collection_id
                                                ? collectionItems.filter(item => item.collection_id === field.collection_id)
                                                : []

                                            const isRequired = field.status === true
                                            const isChecking = checkingFields[formField.id]
                                            const error = reservedNameErrors[formField.id]

                                            return (
                                                <tr key={formField.id}>
                                                    <td className="border border-stone-900 p-2 w-1/3 align-top">
                                                        <div className="font-semibold flex items-center gap-1">
                                                            {formField.field_name || field.label}
                                                            {isRequired && <span className="text-red-500">*</span>}
                                                            {formField.validation === 'validate_reserved_name' && isChecking && (
                                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="border border-stone-900 p-2">
                                                        {field.data_type_id === 1 && (
                                                            <div>
                                                                <Input
                                                                    value={formData[formField.id] || ''}
                                                                    className={cn(
                                                                        "border-stone-400 bg-white h-8 text-xs",
                                                                        error ? "border-red-500" : ""
                                                                    )}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value
                                                                        setFormData({ ...formData, [formField.id]: value })
                                                                        if (formField?.validation === 'validate_reserved_name') {
                                                                            validateReservedName(formField.id, value)
                                                                        }
                                                                    }}
                                                                />
                                                                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                                                            </div>
                                                        )}

                                                        {field.data_type_id === 2 && (
                                                            <Input
                                                                type="number"
                                                                value={formData[formField.id] || ''}
                                                                className="border-stone-400 bg-white h-8 text-xs"
                                                                onChange={(e) => setFormData({ ...formData, [formField.id]: e.target.value })}
                                                            />
                                                        )}

                                                        {field.data_type_id === 3 && (
                                                            <Input
                                                                type="date"
                                                                value={formData[formField.id] || ''}
                                                                className="border-stone-400 bg-white h-8 text-xs"
                                                                onChange={(e) => setFormData({ ...formData, [formField.id]: e.target.value })}
                                                            />
                                                        )}

                                                        {field.data_type_id === 5 && (
                                                            <Select
                                                                value={formData[formField.id] || ''}
                                                                onValueChange={(v) => setFormData({ ...formData, [formField.id]: v })}
                                                            >
                                                                <SelectTrigger className="border-stone-400 bg-white h-8 text-xs">
                                                                    <SelectValue placeholder="Select" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {fieldOptions.map(opt => (
                                                                        <SelectItem key={opt.id} value={opt.collection_item || ''}>
                                                                            {opt.collection_item}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    </td>
                                                    <td className="border border-stone-900 p-2 w-1/4" style={{backgroundColor: '#ffe598'}}></td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            )}

                            <div className="flex gap-4 pt-6 mt-6 border-t-2 border-stone-900">
                                <Button
                                    onClick={handleSubmit}
                                    className="bg-[#8B6F47] hover:bg-[#6F5838]"
                                    disabled={createSubmission.isPending || Object.keys(reservedNameErrors).length > 0}
                                >
                                    {createSubmission.isPending ? 'Creating...' : 'Submit Application'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
