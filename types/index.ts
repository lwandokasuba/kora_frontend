export interface Forms {
    id: number;
    title: string;
    description: string;
    service: string;
    status: number;
}

export interface FormQuestions {
    id: number;
    formId: number;
    questionId: number;
    validations: string;
}

export interface FormAnswers {
    id: number;
    formId: number;
    questionId: number;
    answer: any;
    submissionId: number;
}

export interface Submissions {
    id: number;
    formId: number;
    createdBy: number;
    updatedBy: number;
    deletedBy: number;
}

export interface Questions {
    id: number;
    label: number;
    type: number;
}
