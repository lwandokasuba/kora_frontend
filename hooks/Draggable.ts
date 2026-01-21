'use client'

import React from "react"

export const useDraggable = () => {

    const handleDragStart = (e: React.DragEvent, fieldId: string) => {
        e.dataTransfer.setData("fieldId", fieldId);
        e.dataTransfer.effectAllowed = "move";
    }

    const handleDragOver = (e: React.DragEvent) => {

    }

    return {
        handleDragStart
    }
}
