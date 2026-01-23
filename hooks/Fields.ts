import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { Field, FieldRequest, SuccessResponse } from '../types';

const ENDPOINT = '/field';

// Warning: List endpoint not explicitly documented in Swagger
export const useFields = () => {
    return useQuery<SuccessResponse<Field[]>>({
        queryKey: ['fields'],
        queryFn: () => apiClient.get<SuccessResponse<Field[]>>(ENDPOINT),
    });
};

export const useField = (id: number) => {
    return useQuery<SuccessResponse<Field>>({
        queryKey: ['fields', id],
        queryFn: () => apiClient.getById<SuccessResponse<Field>>(ENDPOINT, id),
        enabled: !!id,
    });
};

export const useCreateField = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: FieldRequest) => apiClient.post<SuccessResponse<Field>>(ENDPOINT, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fields'] });
        },
    });
};

export const useUpdateField = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...data }: FieldRequest & { id: number }) => apiClient.patch<SuccessResponse<Field>>(ENDPOINT, id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['fields'] });
            queryClient.invalidateQueries({ queryKey: ['fields', variables.id] });
        },
    });
};

export const useDeleteField = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => apiClient.delete<SuccessResponse<void>>(ENDPOINT, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fields'] });
        },
    });
};

// Specialized hook for fields by group
// This endpoint /field/group/{groupId} is NOT in Swagger. Keeping it for now but might fail.
export const useFieldsByGroup = (groupId?: number) => {
    return useQuery<SuccessResponse<Field[]>>({
        queryKey: ['fields', 'group', groupId],
        queryFn: () => apiClient.get<SuccessResponse<Field[]>>(`${ENDPOINT}/group/${groupId}`),
        enabled: !!groupId,
    });
};
