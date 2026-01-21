
'use client'

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';
import { FieldType } from './types';

interface ToolboxItemProps {
    type: FieldType;
    label: string;
}

export function ToolboxItem({ type, label }: ToolboxItemProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `toolbox-${type}`,
        data: {
            type,
            isToolboxItem: true,
        },
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={cn(
                "flex items-center gap-2 p-3 border rounded-md bg-card shadow-sm cursor-grab hover:border-primary transition-colors text-sm font-medium",
                isDragging && "opacity-50 ring-2 ring-primary"
            )}
        >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            {label}
        </div>
    );
}

export function ToolboxItemOverlay({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-2 p-3 border rounded-md bg-card shadow-lg cursor-grabbing w-[200px]">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            {label}
        </div>
    )
}
