import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import {
  CalendarIcon,
  UserCircleIcon,
  DocumentIcon,
  LinkIcon,
  TagIcon,
  PaperClipIcon,
  XMarkIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

export default function Card({ card, onUpdate }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCard, setEditedCard] = useState(card);
  const [editingLabelIndex, setEditingLabelIndex] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setEditedCard(card);
  }, [card]);

  const handleInputChange = (field, value) => {
    setEditedCard(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLabelChange = (index, field, value) => {
    const updatedLabels = [...(editedCard.labels || [])];
    updatedLabels[index] = {
      ...updatedLabels[index],
      [field]: value
    };
    handleInputChange('labels', updatedLabels);
  };

  const handleDeleteLabel = (indexToDelete) => {
    const updatedLabels = editedCard.labels?.filter((_, index) => index !== indexToDelete) || [];
    handleInputChange('labels', updatedLabels);
  };

  const handleSave = () => {
    onUpdate(editedCard);
    setIsEditing(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // In a real app, you would upload the file to a server here
    const newAttachment = {
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type
    };

    const updatedCard = {
      ...editedCard,
      attachments: [...(editedCard.attachments || []), newAttachment]
    };
    setEditedCard(updatedCard);
    onUpdate(updatedCard);
  };

  const handleCardClick = () => {
    setIsExpanded(true);
    setIsEditing(true);
  };

  const cardContent = (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900">{card.title}</h3>
        <div className="flex gap-1">
          {card.labels?.map((label, index) => (
            <span
              key={index}
              className="px-2 py-1 rounded text-xs font-medium"
              style={{ backgroundColor: label.color, color: 'white' }}
            >
              {label.name}
            </span>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3">{card.description}</p>

      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <CalendarIcon className="w-4 h-4" />
          {format(new Date(card.createdAt), 'MMM d, yyyy')}
        </div>
        
        <div className="flex items-center gap-1">
          <UserCircleIcon className="w-4 h-4" />
          {card.assignee}
        </div>

        {card.targetDate && (
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" />
            Due: {format(new Date(card.targetDate), 'MMM d, yyyy')}
          </div>
        )}
      </div>
    </div>
  );

  const expandedContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <input
            type="text"
            value={editedCard.title}
            className="text-xl font-semibold w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            onChange={(e) => handleInputChange('title', e.target.value)}
          />
          <button
            onClick={() => {
              setIsExpanded(false);
              setIsEditing(false);
              setEditedCard(card);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={editedCard.description}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                rows={4}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Labels</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {editedCard.labels?.map((label, index) => (
                  <div key={index} className="group relative flex items-center">
                    {editingLabelIndex === index ? (
                      <div className="flex items-center gap-2 p-1 bg-white border rounded shadow-sm">
                        <input
                          type="text"
                          value={label.name}
                          onChange={(e) => handleLabelChange(index, 'name', e.target.value)}
                          className="text-sm px-1 w-24 border-none focus:ring-0"
                          autoFocus
                          onBlur={() => setEditingLabelIndex(null)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setEditingLabelIndex(null);
                            }
                          }}
                        />
                        <input
                          type="color"
                          value={label.color}
                          onChange={(e) => handleLabelChange(index, 'color', e.target.value)}
                          className="w-6 h-6 p-0 border-none"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span
                          className="px-2 py-1 rounded text-sm font-medium cursor-pointer"
                          style={{ backgroundColor: label.color, color: 'white' }}
                          onClick={() => setEditingLabelIndex(index)}
                        >
                          {label.name}
                        </span>
                        <button
                          onClick={() => handleDeleteLabel(index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                        >
                          <XMarkIcon className="w-3 h-3 text-gray-500" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newLabel = {
                      name: 'New Label',
                      color: '#' + Math.floor(Math.random()*16777215).toString(16)
                    };
                    const newIndex = (editedCard.labels || []).length;
                    handleInputChange('labels', [...(editedCard.labels || []), newLabel]);
                    setEditingLabelIndex(newIndex);
                  }}
                  className="px-2 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-600 rounded flex items-center gap-1"
                >
                  <TagIcon className="w-4 h-4" />
                  Add Label
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Attachments</label>
              <div className="mt-1 space-y-2">
                {editedCard.attachments?.map((attachment, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <PaperClipIcon className="w-4 h-4" />
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {attachment.name}
                    </a>
                  </div>
                ))}
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="image/*,.pdf"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add attachment
                  </button>
                </>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={editedCard.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="freezer">Freezer</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Assignee</label>
              <input
                type="text"
                value={editedCard.assignee}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                onChange={(e) => handleInputChange('assignee', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Created</label>
              <p className="mt-1 text-sm text-gray-600">
                {format(new Date(card.createdAt), 'MMM d, yyyy')}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Target Date</label>
              <input
                type="date"
                value={editedCard.targetDate}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                onChange={(e) => handleInputChange('targetDate', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">GitHub Issue URL</label>
              <input
                type="url"
                value={editedCard.githubIssue || ''}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                onChange={(e) => handleInputChange('githubIssue', e.target.value)}
                placeholder="https://github.com/org/repo/issues/1"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => {
              setEditedCard(card);
              setIsExpanded(false);
              setIsEditing(false);
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              handleSave();
              setIsExpanded(false);
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div
        onClick={handleCardClick}
        className="cursor-pointer"
      >
        {cardContent}
      </div>
      {isExpanded && expandedContent}
    </>
  );
}