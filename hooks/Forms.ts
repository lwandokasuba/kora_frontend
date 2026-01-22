import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { Form, CreateForm, UpdateForm } from '../types';

const ENDPOINT = '/forms';

export const useForms = () => {
    return useQuery<Form[]>({
        queryKey: ['forms'],
        queryFn: () => apiClient.get<Form[]>(ENDPOINT),
    });
};

export const useForm = (id: number) => {
    return useQuery<Form>({
        queryKey: ['forms', id],
        queryFn: () => apiClient.getById<Form>(ENDPOINT, id),
        enabled: !!id,
    });
};

export const useCreateForm = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateForm) => apiClient.post<Form>(ENDPOINT, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['forms'] });
        },
    });
};

export const useUpdateForm = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...data }: UpdateForm) => apiClient.put<Form>(ENDPOINT, id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['forms'] });
            queryClient.invalidateQueries({ queryKey: ['forms', variables.id] });
        },
    });
};

export const useDeleteForm = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => apiClient.delete(ENDPOINT, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['forms'] });
        },
    });
};

// Specialized hook for forms by service
export const useFormsByService = (serviceId?: number) => {
    return useQuery<Form[]>({
        queryKey: ['forms', 'service', serviceId],
        queryFn: () => apiClient.get<Form[]>(`${ENDPOINT}/service/${serviceId}`),
        enabled: !!serviceId,
    });
};

// Server-side functions
export async function getFormsSSR(): Promise<Form[]> {
    try {
        return await apiClient.get<Form[]>(ENDPOINT);
    } catch (error) {
        console.error('Failed to fetch forms:', error);
        return [];
    }
}

export async function getFormSSR(id: number): Promise<Form | null> {
    try {
        return await apiClient.getById<Form>(ENDPOINT, id);
    } catch (error) {
        console.error(`Failed to fetch form ${id}:`, error);
        return null;
    }
}

export async function getFormsByServiceSSR(serviceId: number): Promise<Form[]> {
    try {
        return await apiClient.get<Form[]>(`${ENDPOINT}/service/${serviceId}`);
    } catch (error) {
        console.error(`Failed to fetch forms for service ${serviceId}:`, error);
        return [];
    }
}
