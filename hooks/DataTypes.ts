import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { CreateDataType, DataType, UpdateDataType } from '../types';

const ENDPOINT = '/data-types';

export const useDataTypes = () => {
    return useQuery<DataType[]>({
        queryKey: ['dataTypes'],
        queryFn: () => apiClient.get<DataType[]>(ENDPOINT),
    });
};

export const useDataType = (id: number) => {
    return useQuery<DataType>({
        queryKey: ['dataTypes', id],
        queryFn: () => apiClient.getById<DataType>(ENDPOINT, id),
        enabled: !!id,
    });
};

export const useCreateDataType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateDataType) => apiClient.post<DataType>(ENDPOINT, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dataTypes'] });
        },
    });
};

export const useUpdateDataType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...data }: UpdateDataType) => apiClient.put<DataType>(ENDPOINT, id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['dataTypes'] });
            queryClient.invalidateQueries({ queryKey: ['dataTypes', variables.id] });
        },
    });
};

export const useDeleteDataType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => apiClient.delete(ENDPOINT, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dataTypes'] });
        },
    });
};

// Server-side functions
export async function getDataTypesSSR(): Promise<DataType[]> {
    try {
        return await apiClient.get<DataType[]>(ENDPOINT);
    } catch (error) {
        console.error('Failed to fetch data types:', error);
        return [];
    }
}

export async function getDataTypeSSR(id: number): Promise<DataType | null> {
    try {
        return await apiClient.getById<DataType>(ENDPOINT, id);
    } catch (error) {
        console.error(`Failed to fetch data type ${id}:`, error);
        return null;
    }
}
