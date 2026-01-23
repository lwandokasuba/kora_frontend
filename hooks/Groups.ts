import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { CreateGroup, Group, UpdateGroup, SuccessResponse } from '../types';

const ENDPOINT = '/groups';

export const useGroups = () => {
    return useQuery<SuccessResponse<Group[]>>({
        queryKey: ['groups'],
        queryFn: () => apiClient.get<SuccessResponse<Group[]>>(ENDPOINT),
    });
};

export const useGroup = (id: number) => {
    return useQuery<SuccessResponse<Group>>({
        queryKey: ['groups', id],
        queryFn: () => apiClient.getById<SuccessResponse<Group>>(ENDPOINT, id),
        enabled: !!id,
    });
};

export const useCreateGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateGroup) => apiClient.post<SuccessResponse<Group>>(ENDPOINT, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
        },
    });
};

export const useUpdateGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...data }: UpdateGroup & { id: number }) => apiClient.patch<SuccessResponse<Group>>(ENDPOINT, id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            queryClient.invalidateQueries({ queryKey: ['groups', variables.id] });
        },
    });
};

export const useDeleteGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => apiClient.delete<SuccessResponse<void>>(ENDPOINT, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
        },
    });
};
