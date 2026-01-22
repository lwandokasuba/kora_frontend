import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { FormAnswer, CreateFormAnswer, UpdateFormAnswer } from '../types';

const ENDPOINT = '/form-answers';

export const useFormAnswers = () => {
    return useQuery<FormAnswer[]>({
        queryKey: ['form-answers'],
        queryFn: () => apiClient.get<FormAnswer[]>(ENDPOINT),
    });
};

export const useFormAnswer = (id: number) => {
    return useQuery<FormAnswer>({
        queryKey: ['form-answers', id],
        queryFn: () => apiClient.getById<FormAnswer>(ENDPOINT, id),
        enabled: !!id,
    });
};

export const useCreateFormAnswer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateFormAnswer) => apiClient.post<FormAnswer>(ENDPOINT, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['form-answers'] });
        },
    });
};

export const useUpdateFormAnswer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...data }: UpdateFormAnswer) =>
            apiClient.put<FormAnswer>(ENDPOINT, id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['form-answers'] });
            queryClient.invalidateQueries({ queryKey: ['form-answers', variables.id] });
        },
    });
};

export const useDeleteFormAnswer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => apiClient.delete(ENDPOINT, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['form-answers'] });
        },
    });
};

// Specialized hooks
export const useFormAnswersBySubmission = (submissionId?: number) => {
    return useQuery<FormAnswer[]>({
        queryKey: ['form-answers', 'submission', submissionId],
        queryFn: () => apiClient.get<FormAnswer[]>(`${ENDPOINT}/submission/${submissionId}`),
        enabled: !!submissionId,
    });
};

export const useFormAnswersByForm = (formId?: number) => {
    return useQuery<FormAnswer[]>({
        queryKey: ['form-answers', 'form', formId],
        queryFn: () => apiClient.get<FormAnswer[]>(`${ENDPOINT}/form/${formId}`),
        enabled: !!formId,
    });
};

export const useFormAnswersByField = (fieldId?: number) => {
    return useQuery<FormAnswer[]>({
        queryKey: ['form-answers', 'field', fieldId],
        queryFn: () => apiClient.get<FormAnswer[]>(`${ENDPOINT}/field/${fieldId}`),
        enabled: !!fieldId,
    });
};

// Server-side functions
export async function getFormAnswersSSR(): Promise<FormAnswer[]> {
    try {
        return await apiClient.get<FormAnswer[]>(ENDPOINT);
    } catch (error) {
        console.error('Failed to fetch form answers:', error);
        return [];
    }
}

export async function getFormAnswerSSR(id: number): Promise<FormAnswer | null> {
    try {
        return await apiClient.getById<FormAnswer>(ENDPOINT, id);
    } catch (error) {
        console.error(`Failed to fetch form answer ${id}:`, error);
        return null;
    }
}

export async function getFormAnswersBySubmissionSSR(submissionId: number): Promise<FormAnswer[]> {
    try {
        return await apiClient.get<FormAnswer[]>(`${ENDPOINT}/submission/${submissionId}`);
    } catch (error) {
        console.error(`Failed to fetch form answers for submission ${submissionId}:`, error);
        return [];
    }
}

export async function getFormAnswersByFormSSR(formId: number): Promise<FormAnswer[]> {
    try {
        return await apiClient.get<FormAnswer[]>(`${ENDPOINT}/form/${formId}`);
    } catch (error) {
        console.error(`Failed to fetch form answers for form ${formId}:`, error);
        return [];
    }
}

export async function getFormAnswersByFieldSSR(fieldId: number): Promise<FormAnswer[]> {
    try {
        return await apiClient.get<FormAnswer[]>(`${ENDPOINT}/field/${fieldId}`);
    } catch (error) {
        console.error(`Failed to fetch form answers for field ${fieldId}:`, error);
        return [];
    }
}
