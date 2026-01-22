import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { CreateCollection, Collection, UpdateCollection } from '../types';

const ENDPOINT = '/collections';

export const useCollections = () => {
    return useQuery<Collection[]>({
        queryKey: ['collections'],
        queryFn: () => apiClient.get<Collection[]>(ENDPOINT),
    });
};

export const useCollection = (id: number) => {
    return useQuery<Collection>({
        queryKey: ['collections', id],
        queryFn: () => apiClient.getById<Collection>(ENDPOINT, id),
        enabled: !!id,
    });
};

export const useCreateCollection = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCollection) => apiClient.post<Collection>(ENDPOINT, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collections'] });
        },
    });
};

export const useUpdateCollection = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...data }: UpdateCollection) => apiClient.put<Collection>(ENDPOINT, id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['collections'] });
            queryClient.invalidateQueries({ queryKey: ['collections', variables.id] });
        },
    });
};

export const useDeleteCollection = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => apiClient.delete(ENDPOINT, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collections'] });
        },
    });
};

// Server-side functions
export async function getCollectionsSSR(): Promise<Collection[]> {
    try {
        return await apiClient.get<Collection[]>(ENDPOINT);
    } catch (error) {
        console.error('Failed to fetch collections:', error);
        return [];
    }
}

export async function getCollectionSSR(id: number): Promise<Collection | null> {
    try {
        return await apiClient.getById<Collection>(ENDPOINT, id);
    } catch (error) {
        console.error(`Failed to fetch collection ${id}:`, error);
        return null;
    }
}
