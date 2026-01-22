import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { CreateUser, User, UpdateUser } from '../types';

const ENDPOINT = '/users';

export const useUsers = () => {
    return useQuery<User[]>({
        queryKey: ['users'],
        queryFn: () => apiClient.get<User[]>(ENDPOINT),
    });
};

export const useUser = (id: number) => {
    return useQuery<User>({
        queryKey: ['users', id],
        queryFn: () => apiClient.getById<User>(ENDPOINT, id),
        enabled: !!id,
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateUser) => apiClient.post<User>(ENDPOINT, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...data }: UpdateUser) => apiClient.put<User>(ENDPOINT, id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => apiClient.delete(ENDPOINT, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

// Server-side functions
export async function getUsersSSR(): Promise<User[]> {
    try {
        return await apiClient.get<User[]>(ENDPOINT);
    } catch (error) {
        console.error('Failed to fetch users:', error);
        return [];
    }
}

export async function getUserSSR(id: number): Promise<User | null> {
    try {
        return await apiClient.getById<User>(ENDPOINT, id);
    } catch (error) {
        console.error(`Failed to fetch user ${id}:`, error);
        return null;
    }
}
