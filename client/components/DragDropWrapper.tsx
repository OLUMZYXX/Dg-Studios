'use client'

import React, { useState, useEffect } from 'react'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd'

interface DragDropWrapperProps {
  children: React.ReactNode
  onDragEnd: (result: DropResult) => void
  droppableId: string
}

export function DragDropWrapper({
  children,
  onDragEnd,
  droppableId,
}: DragDropWrapperProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Prevent SSR issues by only rendering on client
  if (!isMounted) {
    return <div>{children}</div>
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`transition-colors duration-200 ${
              snapshot.isDraggingOver ? 'bg-blue-50/50' : ''
            }`}
          >
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

interface DraggableItemProps {
  children: (dragHandleProps: any) => React.ReactNode
  draggableId: string
  index: number
  isDragDisabled?: boolean
}

export function DraggableItem({
  children,
  draggableId,
  index,
  isDragDisabled = false,
}: DraggableItemProps) {
  return (
    <Draggable
      draggableId={draggableId}
      index={index}
      isDragDisabled={isDragDisabled}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`transform transition-transform duration-200 ${
            snapshot.isDragging
              ? 'rotate-2 scale-105 shadow-2xl z-50'
              : 'hover:-translate-y-1'
          }`}
        >
          {children(provided.dragHandleProps)}
        </div>
      )}
    </Draggable>
  )
}
