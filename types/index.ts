// types/index.ts
import { z } from 'zod';

// Standard API Response Interfaces
export interface SuccessResponse<T = any> {
    status: boolean;
    message?: string;
    data?: T;
}

export interface ErrorResponse {
    status: boolean;
    error: string;
    code?: number;
}

// Group Schema
export const GroupSchema = z.object({
    id: z.number().int(),
    group_name: z.string().max(50),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    deleted_at: z.string().nullable().optional(),
});

export type Group = z.infer<typeof GroupSchema>;

// DataType Schema (Restored)
export const DataTypeSchema = z.object({
    id: z.number().int(),
    data_type: z.string().max(50)
});
export type DataType = z.infer<typeof DataTypeSchema>;

// Field Schema
export const FieldSchema = z.object({
    id: z.number().int(),
    label: z.string().max(50),
    type: z.string(), // Changed from data_type_id
    group_id: z.number().int().nullable().optional(), // Added for mock data compatibility
    status: z.boolean().optional(), // Added
    is_required: z.boolean().optional(), // New
    meta: z.record(z.string(), z.any()).optional(), // Explicit record
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    deleted_at: z.string().nullable().optional(),
});

export type Field = z.infer<typeof FieldSchema>;

// Form Schema
export const FormSchema = z.object({
    id: z.number().int(),
    title: z.string(), // Changed from form_name
    description: z.string().optional(),
    service_id: z.number().int(),
    status: z.number().int().optional(), // Changed to int
    version: z.number().int().optional(), // New
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    deleted_at: z.string().nullable().optional(),
    fields: z.array(FieldSchema).optional(), // Included in GET /form/{id}
});

export type Form = z.infer<typeof FormSchema>;

// FormField Schema (Association)
export const FormFieldSchema = z.object({
    id: z.number().int(),
    form_id: z.number().int(),
    fields_id: z.number().int(), // Note the property name mismatch in Swagger? Swagger says 'fields_id' in response
    validations: z.record(z.string(), z.any()).optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    deleted_at: z.string().nullable().optional(),
});

export type FormField = z.infer<typeof FormFieldSchema>;

// ReservedName Schema (Restored)
export const ReservedNameSchema = z.object({
    id: z.number().int(),
    name: z.string().max(50),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    deleted_at: z.string().nullable().optional(),
});
export type ReservedName = z.infer<typeof ReservedNameSchema>;

// --- Request Schemas (Restored) ---

export const GroupRequestSchema = z.object({
    group_name: z.string(),
});
export type GroupRequest = z.infer<typeof GroupRequestSchema>;

export const FieldRequestSchema = z.object({
    label: z.string(),
    type: z.string(),
    is_required: z.boolean().optional(),
    meta: z.record(z.string(), z.any()).optional(),
});
export type FieldRequest = z.infer<typeof FieldRequestSchema>;

export const FormFieldReferenceSchema = z.object({
    fields_id: z.number().int(),
    validations: z.record(z.string(), z.any()).optional(),
});
export type FormFieldReference = z.infer<typeof FormFieldReferenceSchema>;

export const FormRequestSchema = z.object({
    service_id: z.number().int(),
    title: z.string(),
    description: z.string().optional(),
    fields: z.array(FormFieldReferenceSchema).optional(),
});
export type FormRequest = z.infer<typeof FormRequestSchema>;

export const UpdateFormStatusRequestSchema = z.object({
    status: z.string(),
});
export type UpdateFormStatusRequest = z.infer<typeof UpdateFormStatusRequestSchema>;


export const FormFieldReferenceSchema = z.object({
    fields_id: z.number().int(),
    validations: z.record(z.string(), z.any()).optional(),
});
export type FormFieldReference = z.infer<typeof FormFieldReferenceSchema>;

// ...

export const FormFieldRequestSchema = z.object({
    field_id: z.number().int(),
    form_id: z.number().int(),
    validations: z.record(z.string(), z.any()).optional(),
});
export type FormFieldRequest = z.infer<typeof FormFieldRequestSchema>;

export const ReservedNameRequestSchema = z.object({
    name: z.string(),
});
export type ReservedNameRequest = z.infer<typeof ReservedNameRequestSchema>;

// Keep previous types that might still be useful or are not covered by this Swagger slice but needed by app
// Service Schema (kept as is, though not fully verified against new Swagger if missing)
export const ServiceSchema = z.object({
    id: z.number().int(),
    service_name: z.string().max(100),
    description: z.string().max(250).optional().nullable()
});
export type Service = z.infer<typeof ServiceSchema>;

// Submission Schema (kept as is for now, need to verify if backend changed)
export const SubmissionSchema = z.object({
    id: z.number().int(),
    services_id: z.number().int().nullable(),
    created_by: z.number().int().nullable(),
    created_on: z.string().nullable(),
    form_id: z.number().int().optional(),
    formAnswers: z.array(z.any()).optional(), // Simplified for now
    formFields: z.array(z.any()).optional() // Restored for UI
});
export type Submission = z.infer<typeof SubmissionSchema>;

// User Schema (Restored)
export const UserSchema = z.object({
    id: z.number().int(),
    first_name: z.string().max(100).nullable(),
    middle_name: z.string().max(100).nullable(),
    surname: z.string().max(100).nullable(),
    dob: z.string().nullable(),
    email: z.string().max(250).nullable(),
    password: z.string().max(250).nullable()
});
export type User = z.infer<typeof UserSchema>;

// FormAnswer Schema (Restored)
export const FormAnswerSchema = z.object({
    id: z.number().int(),
    form_field_id: z.number().int().nullable(),
    answer: z.string().max(250).nullable(),
    submission_id: z.number().int().nullable()
});
export type FormAnswer = z.infer<typeof FormAnswerSchema>;

// Collection Schema (Restored)
export const CollectionSchema = z.object({
    id: z.number().int(),
    collection_name: z.string().max(50).nullable()
});
export type Collection = z.infer<typeof CollectionSchema>;

// CollectionItem Schema (Restored)
export const CollectionItemSchema = z.object({
    id: z.number().int(),
    collection_id: z.number().int().nullable(),
    collection_item: z.string().max(50).nullable(),
    relation_collection_items_id: z.number().int().nullable()
});
export type CollectionItem = z.infer<typeof CollectionItemSchema>;

// Helpers for create/update (mapping to Request schemas where appropriate)
export type CreateGroup = GroupRequest;
export type CreateField = FieldRequest;
export type CreateForm = FormRequest;
export type CreateReservedName = ReservedNameRequest;
export type CreateFormField = FormFieldRequest;

// Restored Create types
export const CreateDataTypeSchema = DataTypeSchema.omit({ id: true });
export type CreateDataType = z.infer<typeof CreateDataTypeSchema>;

export const CreateUserSchema = UserSchema.omit({ id: true });
export type CreateUser = z.infer<typeof CreateUserSchema>;

export const CreateFormAnswerSchema = FormAnswerSchema.omit({ id: true });
export type CreateFormAnswer = z.infer<typeof CreateFormAnswerSchema>;

export const CreateCollectionSchema = CollectionSchema.omit({ id: true });
export type CreateCollection = z.infer<typeof CreateCollectionSchema>;

export const CreateCollectionItemSchema = CollectionItemSchema.omit({ id: true });
export type CreateCollectionItem = z.infer<typeof CreateCollectionItemSchema>;

export const CreateServiceSchema = ServiceSchema.omit({ id: true });
export type CreateService = z.infer<typeof CreateServiceSchema>;

export const CreateSubmissionSchema = SubmissionSchema.omit({ id: true, created_on: true }).extend({
    formAnswers: FormAnswerSchema.omit({ id: true, submission_id: true }).array().optional()
});
export type CreateSubmission = z.infer<typeof CreateSubmissionSchema>;

export type UpdateGroup = GroupRequest;
export type UpdateField = FieldRequest; // PUT usually replaces
export type UpdateReservedName = ReservedNameRequest;
export type UpdateFormField = FormFieldRequest;
export type UpdateForm = FormRequest;

// Add missing Update types
export type UpdateService = CreateService; // Fallback
export type UpdateSubmission = CreateSubmission; // Fallback
export type UpdateFormAnswer = CreateFormAnswer;
export type UpdateCollection = CreateCollection;
export type UpdateCollectionItem = CreateCollectionItem;
export type UpdateUser = CreateUser;

// Re-export specific update schemas if needed for partial updates locally, 
// but API seems to use uniform Request/Response objects.
