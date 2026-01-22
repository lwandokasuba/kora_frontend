import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { CreateCollectionItem, CollectionItem, UpdateCollectionItem } from '../types';

const ENDPOINT = '/collection-items';

export const useCollectionItems = () => {
    return useQuery<CollectionItem[]>({
        queryKey: ['collectionItems'],
        queryFn: () => apiClient.get<CollectionItem[]>(ENDPOINT),
    });
};

export const useCollectionItem = (id: number) => {
    return useQuery<CollectionItem>({
        queryKey: ['collectionItems', id],
        queryFn: () => apiClient.getById<CollectionItem>(ENDPOINT, id),
        enabled: !!id,
    });
};

export const useCollectionItemsByCollection = (collectionId: number | null) => {
    return useQuery<CollectionItem[]>({
        queryKey: ['collectionItems', 'collection', collectionId],
        queryFn: () => apiClient.get<CollectionItem[]>(`${ENDPOINT}/collection/${collectionId}`),
        enabled: !!collectionId,
    });
};

export const useCreateCollectionItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCollectionItem) => apiClient.post<CollectionItem>(ENDPOINT, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collectionItems'] });
        },
    });
};

export const useUpdateCollectionItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...data }: UpdateCollectionItem) => apiClient.put<CollectionItem>(ENDPOINT, id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['collectionItems'] });
            queryClient.invalidateQueries({ queryKey: ['collectionItems', variables.id] });
            if (variables.collection_id) {
                queryClient.invalidateQueries({ queryKey: ['collectionItems', 'collection', variables.collection_id] });
            }
        },
    });
};

export const useDeleteCollectionItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => apiClient.delete(ENDPOINT, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collectionItems'] });
        },
    });
};

// Server-side functions
export async function getCollectionItemsSSR(): Promise<CollectionItem[]> {
    try {
        return await apiClient.get<CollectionItem[]>(ENDPOINT);
    } catch (error) {
        console.error('Failed to fetch collection items:', error);
        return [];
    }
}

export async function getCollectionItemSSR(id: number): Promise<CollectionItem | null> {
    try {
        return await apiClient.getById<CollectionItem>(ENDPOINT, id);
    } catch (error) {
        console.error(`Failed to fetch collection item ${id}:`, error);
        return null;
    }
}
