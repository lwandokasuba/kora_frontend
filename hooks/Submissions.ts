import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { Submission, CreateSubmission, UpdateSubmission } from '../types';

const ENDPOINT = '/submissions';

export const useSubmissions = () => {
    return useQuery<Submission[]>({
        queryKey: ['submissions'],
        queryFn: () => apiClient.get<Submission[]>(ENDPOINT),
    });
};

export const useSubmission = (id: number) => {
    return useQuery<Submission>({
        queryKey: ['submissions', id],
        queryFn: () => apiClient.getById<Submission>(ENDPOINT, id),
        enabled: !!id,
    });
};

export const useCreateSubmission = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateSubmission) => apiClient.post<Submission>(ENDPOINT, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['submissions'] });
        },
    });
};

export const useUpdateSubmission = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...data }: UpdateSubmission) =>
            apiClient.put<Submission>(ENDPOINT, id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['submissions'] });
            queryClient.invalidateQueries({ queryKey: ['submissions', variables.id] });
        },
    });
};

export const useDeleteSubmission = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => apiClient.delete(ENDPOINT, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['submissions'] });
        },
    });
};

// Specialized hook for submissions by form
export const useSubmissionsByForm = (formId?: number) => {
    return useQuery<Submission[]>({
        queryKey: ['submissions', 'form', formId],
        queryFn: () => apiClient.get<Submission[]>(`${ENDPOINT}/form/${formId}`),
        enabled: !!formId,
    });
};

// Server-side functions
export async function getSubmissionsSSR(): Promise<Submission[]> {
    try {
        return await apiClient.get<Submission[]>(ENDPOINT);
    } catch (error) {
        console.error('Failed to fetch submissions:', error);
        return [];
    }
}

export async function getSubmissionSSR(id: number): Promise<Submission | null> {
    try {
        return await apiClient.getById<Submission>(ENDPOINT, id);
    } catch (error) {
        console.error(`Failed to fetch submission ${id}:`, error);
        return null;
    }
}

export async function getSubmissionsByFormSSR(formId: number): Promise<Submission[]> {
    try {
        return await apiClient.get<Submission[]>(`${ENDPOINT}/form/${formId}`);
    } catch (error) {
        console.error(`Failed to fetch submissions for form ${formId}:`, error);
        return [];
    }
}
