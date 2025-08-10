'use client'
import React, { useState } from 'react';
import { FaTasks, FaCheckCircle, FaBook, FaExclamationTriangle } from 'react-icons/fa';

interface Task {
  id: number;
  title: string;
  description: string;
  learningModule: string;
  status: 'To Do' | 'In Progress' | 'Completed';
  points: number;
}

const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Level 1: What is Cybersecurity?',
    description: 'Understand the fundamental concepts of cybersecurity and why it is important in the digital world.',
    learningModule: 'Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These cyberattacks are usually aimed at accessing, changing, or destroying sensitive information; extorting money from users; or interrupting normal business processes. A successful cybersecurity approach has multiple layers of protection spread across the computers, networks, programs, or data that one intends to keep safe.',
    status: 'To Do',
    points: 50,
  },
  {
    id: 2,
    title: 'Level 2: Password Strength',
    description: 'Learn how to create strong, effective passwords and understand the principles of password security.',
    learningModule: 'A strong password is a critical component of online security. It should be long (at least 12 characters), complex (containing a mix of uppercase and lowercase letters, numbers, and symbols), and unique (not reused across different accounts). Avoid using easily guessable information like birthdays or common words. Password managers can help you generate and store strong, unique passwords for all your accounts.',
    status: 'To Do',
    points: 75,
  },
  {
    id: 3,
    title: 'Level 3: Spotting Phishing Emails',
    description: 'Learn to identify phishing emails and understand the tactics used by attackers.',
    learningModule: 'Phishing is a type of social engineering attack often used to steal user data, including login credentials and credit card numbers. It occurs when an attacker, masquerading as a trusted entity, dupes a victim into opening an email, instant message, or text message. The recipient is then tricked into clicking a malicious link, which can lead to the installation of malware, the freezing of their system as part of a ransomware attack or the revealing of sensitive information. Look for red flags like generic greetings, urgent language, suspicious links, and poor grammar.',
    status: 'To Do',
    points: 100,
  }
];

export default function TaskApp() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(tasks[0]);

  const completeTask = (id: number) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, status: 'Completed' } : task));
  };

  return (
    <div className="w-full flex h-full  text-white">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-neutral-700 overflow-y-auto">
        <div className="p-4 font-bold text-xl border-b border-neutral-700 flex items-center gap-2">
          <FaTasks />
          <span>Tasks</span>
        </div>
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => setSelectedTask(task)}
            className={`cursor-pointer px-4 py-3 border-b border-neutral-700 hover:bg-neutral-800 ${
              selectedTask?.id === task.id ? 'bg-neutral-800' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{task.title}</h3>
              {task.status === 'Completed' ? (
                <FaCheckCircle className="text-green-500" />
              ) : (
                <FaExclamationTriangle className="text-yellow-500" />
              )}
            </div>
            <p className="text-sm text-neutral-400">__{task.status}__</p>
          </div>
        ))}
      </div>

      {/* Task Details */}
      <div className="flex-1 p-6 overflow-y-auto">
        {selectedTask ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{selectedTask.title}</h2>
              <span className="text-lg font-semibold text-yellow-400">{selectedTask.points} Points</span>
            </div>
            <p className="mb-4 text-neutral-300">{selectedTask.description}</p>
            <div className="mb-6 p-4 bg-neutral-800 rounded-lg">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <FaBook />
                <span>Learning Module</span>
              </h3>
              <p className="text-neutral-300">{selectedTask.learningModule}</p>
            </div>
            {selectedTask.status !== 'Completed' && (
              <button
                onClick={() => completeTask(selectedTask.id)}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <FaCheckCircle />
                <span>Mark as Complete</span>
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-neutral-500">Select a task to view its details</p>
          </div>
        )}
      </div>
    </div>
  );
}