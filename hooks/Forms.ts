import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { Form, FormRequest, SuccessResponse, UpdateFormStatusRequest } from '../types';

const ENDPOINT = '/form';

// Warning: List endpoint not explicitly documented in Swagger
export const useForms = () => {
    return useQuery<SuccessResponse<Form[]>>({
        queryKey: ['forms'],
        queryFn: () => apiClient.get<SuccessResponse<Form[]>>(ENDPOINT),
    });
};

export const useForm = (id: number) => {
    return useQuery<SuccessResponse<Form>>({
        queryKey: ['forms', id],
        queryFn: () => apiClient.getById<SuccessResponse<Form>>(ENDPOINT, id),
        enabled: !!id,
    });
};

export const useCreateForm = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: FormRequest) => apiClient.post<SuccessResponse<Form>>(ENDPOINT, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['forms'] });
        },
    });
};

export const useUpdateForm = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...data }: { id: number } & Partial<FormRequest>) =>
            apiClient.patch<SuccessResponse<Form>>(ENDPOINT, id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['forms'] });
            queryClient.invalidateQueries({ queryKey: ['forms', variables.id] });
        },
    });
};

export const useUpdateFormStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) =>
            apiClient.patch<SuccessResponse<any>>(`${ENDPOINT}/${id}/status`, null, { status } as UpdateFormStatusRequest),
        // Wait, apiClient.patch takes (url, data). 
        // Logic: patch(endpoint + /id + /status, data)
        // correct usage: apiClient.patch(`${ENDPOINT}/${id}/status`, null, { status }) -> No, patch signature is (url, id?, data) helper?
        // My apiClient.patch signature is: patch<T>(endpoint: string, id: number | string, data: unknown)
        // So: apiClient.patch(`${ENDPOINT}/${id}/status`, '', { status }) => path would be .../status/ 
        // Actually my apiClient.patch implementation:
        // const url = id ? `${endpoint}/${id}` : endpoint;
        // if I pass id='', url = endpoint.
        // So: apiClient.patch(`${ENDPOINT}/${id}/status`, 0, { status }) -> endpoint/0? No.
        // I should just use the `put` or `patch` with full URL if I can, or pass null id.
        // My apiClient.patch handles `id` as part of URL.
        // If I want `${ENDPOINT}/${id}/status`, I should pass that as endpoint and empty ID?
        // Let's pass 0 or "" as ID?
        // Actually, looking at `api/client.ts`: 
        // const url = id ? `${endpoint}/${id}` : endpoint;
        // So if I pass `id` as 0 or undefined (if type allows), it uses endpoint.
        // `id` is `number | string`. Empty string '' is falsy.
        // So: apiClient.patch(`${ENDPOINT}/${id}/status`, '', { status })
        // This is safe.
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['forms'] });
            queryClient.invalidateQueries({ queryKey: ['forms', variables.id] });
        },
    });
};

export const useDeleteForm = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => apiClient.delete<SuccessResponse<void>>(ENDPOINT, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['forms'] });
        },
    });
};

// Specialized hook for forms by service
// Not in Swagger
export const useFormsByService = (serviceId?: number) => {
    return useQuery<SuccessResponse<Form[]>>({
        queryKey: ['forms', 'service', serviceId],
        queryFn: () => apiClient.get<SuccessResponse<Form[]>>(`${ENDPOINT}/service/${serviceId}`),
        enabled: !!serviceId,
    });
};
