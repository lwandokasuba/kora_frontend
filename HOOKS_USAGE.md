# Hooks & SSR Usage Guidelines

This project uses a pattern where data fetching hooks and Server-Side Rendering (SSR) fetch functions are co-located. This allows you to fetch data efficiently on the server and pass it to the client for immediate rendering.

## Standard Pattern

### 1. Server Component (Page)

Fetch data on the server using the `...SSR` functions exported from the hooks files. Pass the data as props to your Client Component.

```tsx
// app/groups/page.tsx
import { getGroupsSSR } from '@/hooks/Groups';
import GroupsClientComponent from './GroupsClientComponent';

export default async function GroupsPage() {
  // Fetch data on the server
  const initialGroups = await getGroupsSSR();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Groups</h1>
      {/* Pass initial data to client component */}
      <GroupsClientComponent initialGroups={initialGroups} />
    </div>
  );
}
```

### 2. Client Component

Receive the initial data and use it to display content immediately. You can combine it with the hook to get updates or cache management.

```tsx
// app/groups/GroupsClientComponent.tsx
'use client';

import { useGroups } from '@/hooks/Groups';
import { Group } from '@/types';

interface GroupsClientComponentProps {
  initialGroups: Group[];
}

export default function GroupsClientComponent({ 
  initialGroups 
}: GroupsClientComponentProps) {
  // Use the hook (will use cached data if available)
  const { data: groups, isLoading, error } = useGroups();
  
  // Use the hook data if available (e.g. after refetch), falling back to initial SSR data
  const displayGroups = groups || initialGroups;

  // Handle loading state only if we have NO data at all
  if (isLoading && !displayGroups.length) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {displayGroups.map((group) => (
        <div key={group.id} className="border rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-lg">{group.group_name}</h3>
          <p className="text-sm text-gray-600">ID: {group.id}</p>
        </div>
      ))}
    </div>
  );
}
```

## Available Hooks & SSR Functions

All hooks are located in `@/hooks/[Entity].ts`.

| Entity | Hook | SSR Function | Specialized Hook / SSR |
|--------|------|--------------|------------------------|
| **Groups** | `useGroups`<br>`useGroup(id)` | `getGroupsSSR`<br>`getGroupSSR(id)` | - |
| **Fields** | `useFields`<br>`useField(id)` | `getFieldsSSR`<br>`getFieldSSR(id)` | `useFieldsByGroup(id)`<br>`getFieldsByGroupSSR(id)` |
| **Forms** | `useForms`<br>`useForm(id)` | `getFormsSSR`<br>`getFormSSR(id)` | `useFormsByService(id)`<br>`getFormsByServiceSSR(id)` |
| **Services** | `useServices`<br>`useService(id)` | `getServicesSSR`<br>`getServiceSSR(id)` | - |
| **Submissions** | `useSubmissions`<br>`useSubmission(id)` | `getSubmissionsSSR`<br>`getSubmissionSSR(id)` | `useSubmissionsByForm(id)`<br>`getSubmissionsByFormSSR(id)` |
| **Form Fields** | `useFormFields`<br>`useFormField(id)` | `getFormFieldsSSR`<br>`getFormFieldSSR(id)` | `useFormFieldsByForm(id)`<br>`getFormFieldsByFormSSR(id)`<br>`useFormFieldsByField(id)`<br>`getFormFieldsByFieldSSR(id)` |
| **Form Answers** | `useFormAnswers`<br>`useFormAnswer(id)` | `getFormAnswersSSR`<br>`getFormAnswerSSR(id)` | `useFormAnswersBySubmission(id)`<br>`getFormAnswersBySubmissionSSR(id)`<br>`useFormAnswersByForm(id)`<br>`getFormAnswersByFormSSR(id)`<br>`useFormAnswersByField(id)`<br>`getFormAnswersByFieldSSR(id)` |

## Using `initialData` with React Query (Advanced)

If you prefer to hydrate the React Query cache directly so the hook knows about the data immediately:

You would need to modify the hooks to accept `options`, or use the `HydrationBoundary` pattern provided by TanStack Query. 

For the pattern documented above (Props passing), the implementation provided is sufficient.
