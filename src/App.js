import React from 'react';
import './App.css';
import KanbanBoard from './components/KanbanBoard';

const sampleCards = [
  {
    id: '1',
    title: 'Implement Authentication',
    description: 'Add user authentication using JWT tokens',
    status: 'todo',
    assignee: 'John Doe',
    createdAt: '2024-03-11',
    targetDate: '2024-03-25',
    githubIssue: 'https://github.com/org/repo/issues/1',
    labels: [
      { name: 'Feature', color: '#0052cc' },
      { name: 'Priority', color: '#e11d21' }
    ],
    attachments: [
      { name: 'auth-flow.pdf', url: '#' }
    ]
  },
  {
    id: '2',
    title: 'Design System Updates',
    description: 'Update component library with new design tokens',
    status: 'in-progress',
    assignee: 'Jane Smith',
    createdAt: '2024-03-10',
    targetDate: '2024-03-20',
    githubIssue: 'https://github.com/org/repo/issues/2',
    labels: [
      { name: 'Design', color: '#fbca04' }
    ]
  },
  {
    id: '3',
    title: 'API Documentation',
    description: 'Document all REST endpoints',
    status: 'freezer',
    assignee: 'Mike Johnson',
    createdAt: '2024-03-09',
    targetDate: '2024-03-30',
    labels: [
      { name: 'Documentation', color: '#0e8a16' }
    ]
  }
];

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <KanbanBoard initialCards={sampleCards} />
      </div>
    </div>
  );
}

export default App;
