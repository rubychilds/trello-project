import React from 'react';
import Card from './Card';

export default function Column({ id, title, cards, onCardUpdate }) {
  return (
    <div className="w-80 shrink-0 bg-gray-100 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <span className="bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm">
          {cards.length}
        </span>
      </div>
      
      <div className="flex flex-col gap-3 min-h-[200px]">
        {cards.map(card => (
          <Card
            key={card.id}
            card={card}
            onUpdate={onCardUpdate}
          />
        ))}
      </div>
    </div>
  );
}