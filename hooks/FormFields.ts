import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { FormField, CreateFormField, UpdateFormField } from '../types';

const ENDPOINT = '/form-fields';

export const useFormFields = () => {
    return useQuery<FormField[]>({
        queryKey: ['form-fields'],
        queryFn: () => apiClient.get<FormField[]>(ENDPOINT),
    });
};

export const useFormField = (id: number) => {
    return useQuery<FormField>({
        queryKey: ['form-fields', id],
        queryFn: () => apiClient.getById<FormField>(ENDPOINT, id),
        enabled: !!id,
    });
};

export const useCreateFormField = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateFormField) => apiClient.post<FormField>(ENDPOINT, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['form-fields'] });
        },
    });
};

export const useUpdateFormField = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...data }: UpdateFormField) =>
            apiClient.put<FormField>(ENDPOINT, id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['form-fields'] });
            queryClient.invalidateQueries({ queryKey: ['form-fields', variables.id] });
        },
    });
};

export const useDeleteFormField = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => apiClient.delete(ENDPOINT, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['form-fields'] });
        },
    });
};

// Specialized hooks
export const useFormFieldsByForm = (formId?: number) => {
    return useQuery<FormField[]>({
        queryKey: ['form-fields', 'form', formId],
        queryFn: () => apiClient.get<FormField[]>(`${ENDPOINT}/form/${formId}`),
        enabled: !!formId,
    });
};

export const useFormFieldsByField = (fieldId?: number) => {
    return useQuery<FormField[]>({
        queryKey: ['form-fields', 'field', fieldId],
        queryFn: () => apiClient.get<FormField[]>(`${ENDPOINT}/field/${fieldId}`),
        enabled: !!fieldId,
    });
};

// Server-side functions
export async function getFormFieldsSSR(): Promise<FormField[]> {
    try {
        return await apiClient.get<FormField[]>(ENDPOINT);
    } catch (error) {
        console.error('Failed to fetch form fields:', error);
        return [];
    }
}

export async function getFormFieldSSR(id: number): Promise<FormField | null> {
    try {
        return await apiClient.getById<FormField>(ENDPOINT, id);
    } catch (error) {
        console.error(`Failed to fetch form field ${id}:`, error);
        return null;
    }
}

export async function getFormFieldsByFormSSR(formId: number): Promise<FormField[]> {
    try {
        return await apiClient.get<FormField[]>(`${ENDPOINT}/form/${formId}`);
    } catch (error) {
        console.error(`Failed to fetch form fields for form ${formId}:`, error);
        return [];
    }
}

export async function getFormFieldsByFieldSSR(fieldId: number): Promise<FormField[]> {
    try {
        return await apiClient.get<FormField[]>(`${ENDPOINT}/field/${fieldId}`);
    } catch (error) {
        console.error(`Failed to fetch form fields for field ${fieldId}:`, error);
        return [];
    }
}
