import React, { useState } from 'react';
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import Column from './Column';
import Card from './Card';

const defaultColumns = [
  { id: 'freezer', title: 'Freezer' },
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' }
];

export default function KanbanBoard({ initialCards = [] }) {
  const [columns] = useState(defaultColumns);
  const [cards, setCards] = useState(initialCards);
  const [activeCard, setActiveCard] = useState(null);

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveCard(cards.find(card => card.id === active.id));
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeCard = cards.find(card => card.id === active.id);
    const overColumn = columns.find(col => col.id === over.id);

    if (!activeCard || !overColumn) return;

    setCards(cards.map(card => {
      if (card.id === activeCard.id) {
        return { ...card, status: overColumn.id };
      }
      return card;
    }));
  };

  const handleDragEnd = () => {
    setActiveCard(null);
  };

  const handleCardUpdate = (updatedCard) => {
    setCards(cards.map(card => 
      card.id === updatedCard.id ? updatedCard : card
    ));
  };

  const handleCardCreate = () => {
    const newCard = {
      id: `card-${Date.now()}`,
      title: 'New Card',
      description: '',
      status: 'todo',
      assignee: '',
      createdAt: new Date().toISOString().split('T')[0],
      labels: [],
      attachments: []
    };
    setCards([...cards, newCard]);
  };

  return (
    <div className="h-full min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
        <button
          onClick={handleCardCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add New Card
        </button>
      </div>
      
      <DndContext
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map(column => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              cards={cards.filter(card => card.status === column.id)}
              onCardUpdate={handleCardUpdate}
            />
          ))}
        </div>
        <DragOverlay>
          {activeCard ? (
            <Card
              card={activeCard}
              isDragging={true}
              onUpdate={handleCardUpdate}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
} 