import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { FormField, CreateFormField, UpdateFormField, SuccessResponse } from '../types';

const ENDPOINT = '/form_fields';

export const useFormFields = () => {
    return useQuery<SuccessResponse<FormField[]>>({
        queryKey: ['form-fields'],
        queryFn: () => apiClient.get<SuccessResponse<FormField[]>>(ENDPOINT),
    });
};

export const useFormField = (id: number) => {
    return useQuery<SuccessResponse<FormField>>({
        queryKey: ['form-fields', id],
        queryFn: () => apiClient.getById<SuccessResponse<FormField>>(ENDPOINT, id),
        enabled: !!id,
    });
};

export const useCreateFormField = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateFormField) => apiClient.post<SuccessResponse<FormField>>(ENDPOINT, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['form-fields'] });
        },
    });
};

export const useCreateMultipleFormFields = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateFormField[]) =>
            apiClient.post<SuccessResponse<FormField[]>>(`${ENDPOINT}/multiple`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['form-fields'] });
        },
    });
};

export const useUpdateFormField = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...data }: UpdateFormField & { id: number }) =>
            apiClient.patch<SuccessResponse<FormField>>(ENDPOINT, id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['form-fields'] });
            queryClient.invalidateQueries({ queryKey: ['form-fields', variables.id] });
        },
    });
};

export const useDeleteFormField = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => apiClient.delete<SuccessResponse<void>>(ENDPOINT, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['form-fields'] });
        },
    });
};

// Specialized hooks
// These endpoints are not in Swagger, assuming backend supports them or we might need to filter client side if not.
// For now, keeping the URL pattern consistent: /form_fields/form/{id}
export const useFormFieldsByForm = (formId?: number) => {
    return useQuery<SuccessResponse<FormField[]>>({
        queryKey: ['form-fields', 'form', formId],
        queryFn: () => apiClient.get<SuccessResponse<FormField[]>>(`${ENDPOINT}/form/${formId}`),
        enabled: !!formId,
    });
};

export const useFormFieldsByField = (fieldId?: number) => {
    return useQuery<SuccessResponse<FormField[]>>({
        queryKey: ['form-fields', 'field', fieldId],
        queryFn: () => apiClient.get<SuccessResponse<FormField[]>>(`${ENDPOINT}/field/${fieldId}`),
        enabled: !!fieldId,
    });
};
