// api/factory.ts
import {
    CreateGroup, CreateField, CreateService, CreateForm, CreateFormField, CreateSubmission, CreateFormAnswer,
    Group, Service, Form, FormField, Submission, FormAnswer, Field, DataType, CreateDataType, User, CreateUser,
    Collection, CreateCollection, CollectionItem, CreateCollectionItem, ReservedName, CreateReservedName,
    UpdateGroup, UpdateField, UpdateService, UpdateForm, UpdateFormField, UpdateSubmission, UpdateFormAnswer,
    UpdateCollection, UpdateCollectionItem, UpdateReservedName, UpdateUser
} from '@/types';
import { mockDb } from './mockClient';

// Use NEXT_PUBLIC_ prefix
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

// Mock implementation
const mockApiClient = {
    async get<T>(endpoint: string): Promise<T> {
        // Check if we're in browser environment for console logs
        if (typeof window !== 'undefined') {
            console.log(`📨 [MOCK GET] ${endpoint}`);
        }

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        switch (endpoint) {
            case '/groups':
                return { status: true, data: mockDb.getGroups() } as T;
            case '/reserved-name':
                return { status: true, data: mockDb.getReservedNames() } as T;
            case '/data-types':
                return { status: true, data: mockDb.getDataTypes() } as T;
            case '/field':
                return { status: true, data: mockDb.getFields() } as T;
            case '/services':
                return { status: true, data: mockDb.getServices() } as T;
            case '/form':
                return { status: true, data: mockDb.getForms() } as T;
            case '/form_fields':
                return { status: true, data: mockDb.getFormFields() } as T;
            case '/users':
                return { status: true, data: mockDb.getUsers() } as T;
            case '/submissions':
                return { status: true, data: mockDb.getSubmissions() } as T;
            case '/form-answers':
                return { status: true, data: mockDb.getFormAnswers() } as T;
            case '/collections':
                return { status: true, data: mockDb.getCollections() } as T;
            case '/collection-items':
                return { status: true, data: mockDb.getCollectionItems() } as T;
            default:
                // Handle dynamic routes
                if (endpoint.startsWith('/field/group/')) {
                    const groupId = parseInt(endpoint.split('/')[3]);
                    return { status: true, data: mockDb.getFieldsByGroup(groupId) } as T;
                }
                if (endpoint.startsWith('/form/service/')) {
                    const serviceId = parseInt(endpoint.split('/')[3]);
                    return { status: true, data: mockDb.getFormsByService(serviceId) } as T;
                }
                if (endpoint.startsWith('/form_fields/form/')) {
                    const formId = parseInt(endpoint.split('/')[3]);
                    return { status: true, data: mockDb.getFormFieldsByForm(formId) } as T;
                }
                if (endpoint.startsWith('/form_fields/field/')) {
                    const fieldId = parseInt(endpoint.split('/')[3]);
                    return { status: true, data: mockDb.getFormFieldsByField(fieldId) } as T;
                }
                if (endpoint.startsWith('/submissions/service/')) {
                    const serviceId = parseInt(endpoint.split('/')[3]);
                    return { status: true, data: mockDb.getSubmissionsByService(serviceId) } as T;
                }
                throw new Error(`Mock endpoint not implemented: ${endpoint}`);
        }
    },

    async getById<T>(endpoint: string, id: number | string): Promise<T> {
        if (typeof window !== 'undefined') {
            console.log(`📨 [MOCK GET BY ID] ${endpoint}/${id}`);
        }

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // Handle string IDs or special routes
        if (endpoint === '/reserved-name') {
            // Special case for checkReservedName using string
            const matches = mockDb.checkReservedName(String(id));
            return { status: true, data: matches } as T;
        }

        const numId = Number(id);

        switch (endpoint) {
            case '/groups': {
                const group = mockDb.getGroup(numId);
                if (group) return { status: true, data: group } as T;
                throw new Error(`Group with id ${id} not found`);
            }
            case '/data-types': {
                const dataType = mockDb.getDataType(numId);
                if (dataType) return { status: true, data: dataType } as T;
                throw new Error(`DataType with id ${id} not found`);
            }
            case '/field': {
                const field = mockDb.getField(numId);
                if (field) return { status: true, data: field } as T;
                throw new Error(`Field with id ${id} not found`);
            }
            case '/services': {
                const service = mockDb.getService(numId);
                if (service) return { status: true, data: service } as T;
                throw new Error(`Service with id ${id} not found`);
            }
            case '/form': {
                const form = mockDb.getForm(numId);
                if (form) return { status: true, data: form } as T;
                throw new Error(`Form with id ${id} not found`);
            }
            case '/form_fields': {
                const formField = mockDb.getFormField(numId);
                if (formField) return { status: true, data: formField } as T;
                throw new Error(`Form Field with id ${id} not found`);
            }
            case '/users': {
                const user = mockDb.getUser(numId);
                if (user) return { status: true, data: user } as T;
                throw new Error(`User with id ${id} not found`);
            }
            case '/submissions': {
                const submission = mockDb.getSubmission(numId);
                if (submission) return { status: true, data: submission } as T;
                throw new Error(`Submission with id ${id} not found`);
            }
            case '/collections': {
                const collection = mockDb.getCollection(numId);
                if (collection) return { status: true, data: collection } as T;
                throw new Error(`Collection with id ${id} not found`);
            }
            case '/collection-items': {
                const collectionItem = mockDb.getCollectionItem(numId);
                if (collectionItem) return { status: true, data: collectionItem } as T;
                throw new Error(`Collection Item with id ${id} not found`);
            }
            default:
                throw new Error(`Mock GET BY ID endpoint not implemented: ${endpoint}`);
        }
    },

    async post<T>(endpoint: string, data: unknown): Promise<T> {
        if (typeof window !== 'undefined') {
            console.log(`📨 [MOCK POST] ${endpoint}`, data);
        }

        await new Promise(resolve => setTimeout(resolve, 300));

        switch (endpoint) {
            case '/groups':
                return { status: true, data: mockDb.createGroup(data as CreateGroup) } as T;
            case '/reserved-name':
                return { status: true, data: mockDb.createReservedName(data as CreateReservedName) } as T;
            case '/data-types':
                return { status: true, data: mockDb.createDataType(data as CreateDataType) } as T;
            case '/field':
                return { status: true, data: mockDb.createField(data as CreateField) } as T;
            case '/services':
                return { status: true, data: mockDb.createService(data as CreateService) } as T;
            case '/form':
                return { status: true, data: mockDb.createForm(data as CreateForm) } as T;
            case '/form_fields':
                return { status: true, data: mockDb.createFormField(data as CreateFormField) } as T;
            case '/users':
                return { status: true, data: mockDb.createUser(data as CreateUser) } as T;
            case '/submissions':
                return { status: true, data: mockDb.createSubmission(data as CreateSubmission) } as T;
            // ... add others
            default:
                if (endpoint === '/form_fields/multiple') {
                    const items = data as CreateFormField[];
                    const created = items.map(item => mockDb.createFormField(item));
                    return { status: true, data: created } as T;
                }
                throw new Error(`Mock POST endpoint not implemented: ${endpoint}`);
        }
    },

    // Map put to patch for updates as Hooks use PATCH now, but some might still use PUT
    async put<T>(endpoint: string, id: number | string, data: unknown): Promise<T> {
        return this.patch(endpoint, id, data);
    },

    async patch<T>(endpoint: string, id: number | string, data: unknown): Promise<T> {
        if (typeof window !== 'undefined') {
            console.log(`📨 [MOCK PATCH] ${endpoint}/${id}`, data);
        }

        await new Promise(resolve => setTimeout(resolve, 300));
        const numId = Number(id);

        switch (endpoint) {
            case '/groups': {
                const result = mockDb.updateGroup(numId, data as Partial<Group>);
                if (result) return { status: true, data: result } as T;
                throw new Error('Group not found');
            }
            case '/field': {
                const result = mockDb.updateField(numId, data as Partial<Field>);
                if (result) return { status: true, data: result } as T;
                throw new Error('Field not found');
            }
            case '/form': {
                const result = mockDb.updateForm(numId, data as Partial<Form>);
                if (result) return { status: true, data: result } as T;
                throw new Error('Form not found');
            }
            case '/form_fields': {
                const result = mockDb.updateFormField(numId, data as Partial<FormField>);
                if (result) return { status: true, data: result } as T;
                throw new Error('Form Field not found');
            }
            // ... add others
            default:
                // Handle specialized patch routes
                if (endpoint.endsWith('/status')) {
                    // e.g. /form/1/status
                    // Extract ID from endpoint because `id` arg might be empty/different
                    const parts = endpoint.split('/');
                    // /form/1/status -> parts = ['', 'form', '1', 'status']
                    const realId = parseInt(parts[2]);
                    const result = mockDb.updateForm(realId, data as Partial<Form>);
                    if (result) return { status: true, data: result } as T;
                    throw new Error('Form not found');
                }
                throw new Error(`Mock PATCH endpoint not implemented: ${endpoint}`);
        }
    },

    async delete<T>(endpoint: string, id: number | string): Promise<T> {
        if (typeof window !== 'undefined') {
            console.log(`📨 [MOCK DELETE] ${endpoint}/${id}`);
        }

        await new Promise(resolve => setTimeout(resolve, 300));
        const numId = Number(id);

        switch (endpoint) {
            case '/groups': {
                const success = mockDb.deleteGroup(numId);
                if (!success) throw new Error('Group not found');
                return { status: true } as T;
            }
            case '/field': {
                const success = mockDb.deleteField(numId);
                if (!success) throw new Error('Field not found');
                return { status: true } as T;
            }
            case '/form': {
                const success = mockDb.deleteForm(numId);
                if (!success) throw new Error('Form not found');
                return { status: true } as T;
            }
            case '/form_fields': {
                const success = mockDb.deleteFormField(numId);
                if (!success) throw new Error('Form Field not found');
                return { status: true } as T;
            }
            default:
                throw new Error(`Mock DELETE endpoint not implemented: ${endpoint}`);
        }
    }
};

// Initialize mock database when using mock API
if (USE_MOCK_API) {
    mockDb.initialize().catch(console.error);
}

export { mockApiClient };
