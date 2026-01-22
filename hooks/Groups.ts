import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { CreateGroup, Group, UpdateGroup } from '../types';

const ENDPOINT = '/groups';

export const useGroups = () => {
    return useQuery<Group[]>({
        queryKey: ['groups'],
        queryFn: () => apiClient.get<Group[]>(ENDPOINT),
    });
};

export const useGroup = (id: number) => {
    return useQuery<Group>({
        queryKey: ['groups', id],
        queryFn: () => apiClient.getById<Group>(ENDPOINT, id),
        enabled: !!id,
    });
};

export const useCreateGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateGroup) => apiClient.post<Group>(ENDPOINT, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
        },
    });
};

export const useUpdateGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...data }: UpdateGroup) => apiClient.put<Group>(ENDPOINT, id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            queryClient.invalidateQueries({ queryKey: ['groups', variables.id] });
        },
    });
};

export const useDeleteGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => apiClient.delete(ENDPOINT, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
        },
    });
};

// Server-side functions
export async function getGroupsSSR(): Promise<Group[]> {
    try {
        return await apiClient.get<Group[]>(ENDPOINT);
    } catch (error) {
        console.error('Failed to fetch groups:', error);
        return [];
    }
}

export async function getGroupSSR(id: number): Promise<Group | null> {
    try {
        return await apiClient.getById<Group>(ENDPOINT, id);
    } catch (error) {
        console.error(`Failed to fetch group ${id}:`, error);
        return null;
    }
}
