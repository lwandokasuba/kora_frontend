import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { Field, CreateField, UpdateField } from '../types';

const ENDPOINT = '/fields';

export const useFields = () => {
    return useQuery<Field[]>({
        queryKey: ['fields'],
        queryFn: () => apiClient.get<Field[]>(ENDPOINT),
    });
};

export const useField = (id: number) => {
    return useQuery<Field>({
        queryKey: ['fields', id],
        queryFn: () => apiClient.getById<Field>(ENDPOINT, id),
        enabled: !!id,
    });
};

export const useCreateField = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateField) => apiClient.post<Field>(ENDPOINT, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fields'] });
        },
    });
};

export const useUpdateField = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...data }: UpdateField) => apiClient.put<Field>(ENDPOINT, id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['fields'] });
            queryClient.invalidateQueries({ queryKey: ['fields', variables.id] });
        },
    });
};

export const useDeleteField = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => apiClient.delete(ENDPOINT, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fields'] });
        },
    });
};

// Specialized hook for fields by group
export const useFieldsByGroup = (groupId?: number) => {
    return useQuery<Field[]>({
        queryKey: ['fields', 'group', groupId],
        queryFn: () => apiClient.get<Field[]>(`${ENDPOINT}/group/${groupId}`),
        enabled: !!groupId,
    });
};

// Server-side functions
export async function getFieldsSSR(): Promise<Field[]> {
    try {
        return await apiClient.get<Field[]>(ENDPOINT);
    } catch (error) {
        console.error('Failed to fetch fields:', error);
        return [];
    }
}

export async function getFieldSSR(id: number): Promise<Field | null> {
    try {
        return await apiClient.getById<Field>(ENDPOINT, id);
    } catch (error) {
        console.error(`Failed to fetch field ${id}:`, error);
        return null;
    }
}

export async function getFieldsByGroupSSR(groupId: number): Promise<Field[]> {
    try {
        return await apiClient.get<Field[]>(`${ENDPOINT}/group/${groupId}`);
    } catch (error) {
        console.error(`Failed to fetch fields for group ${groupId}:`, error);
        return [];
    }
}
