'use client'
import React, { useState, useEffect } from 'react'; // Added useEffect
import { FaTasks, FaCheckCircle, FaBook, FaExclamationTriangle } from 'react-icons/fa';
import { invoke } from '@tauri-apps/api/core';
import { useAuth } from '../../Context/AuthContext';

// New interfaces matching Rust structs
interface UniversalTask {
  id: number;
  title: string;
  description: string;
  learning_module: string | null;
  points: number;
  task_type: 'knowledge' | 'action';
  task_data: string | null;
  level: number; // Added level field
}

interface UserTask {
  id: number; // This is the user_tasks table ID, not universal_task_id
  user_id: number;
  universal_task_id: number;
  status: string; // e.g., "To Do", "In Progress", "Completed"
  completed_at: string | null; // NaiveDateTime will be string from Rust
  created_at: string;
}

// Combined interface for display
interface DisplayTask extends UniversalTask {
  user_task_id?: number; // Optional, if user has an entry for this task
  status: 'To Do' | 'In Progress' | 'Completed';
  task_data_parsed?: any; // Parsed JSON from task_data
}

const ActionTask = ({ task, onComplete }: { task: DisplayTask, onComplete: (taskId: number) => void }) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    if (!task.task_data_parsed) return;

    try {
      let result = false;
      if (task.title === 'Crack the Password') {
        result = await invoke('verify_password_crack', { password: inputValue });
      } else if (task.title === 'Encrypt the Evidence') {
        result = await invoke('verify_file_encryption', { filePath: task.task_data_parsed.file_path });
      } else if (task.title === 'Find the Hidden Message') {
        result = await invoke('verify_hidden_file', { content: inputValue });
      }

      if (result) {
        onComplete(task.id);
      } else {
        setError('Incorrect submission. Please try again.');
      }
    } catch (err) {
      console.error('Error verifying task:', err);
      setError('An error occurred while verifying the task.');
    }
  };

  const renderTaskInput = () => {
    if (!task.task_data_parsed) return null;

    switch (task.title) {
      case 'Crack the Password':
        return (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter the password"
            className="w-full p-2 rounded-md border border-neutral-700 bg-neutral-800 text-white"
          />
        );
      case 'Encrypt the Evidence':
        return <p className="text-neutral-300">Click the button below when you have encrypted the file.</p>;
      case 'Find the Hidden Message':
        return (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter the hidden message"
            className="w-full p-2 rounded-md border border-neutral-700 bg-neutral-800 text-white"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-4">
        {renderTaskInput()}
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {task.status !== 'Completed' && (
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <span>Submit</span>
        </button>
      )}
    </div>
  );
};

export default function TaskApp() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<DisplayTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<DisplayTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const universalTasks: UniversalTask[] = await invoke('get_universal_tasks');
        let userTasks: UserTask[] = [];

        if (user) {
          userTasks = await invoke('get_user_tasks', { userId: user.id });
        }

        const combinedTasks: DisplayTask[] = universalTasks.map(uTask => {
          const matchingUserTask = userTasks.find(ut => ut.universal_task_id === uTask.id);
          let task_data_parsed;
          if (uTask.task_data) {
            try {
              task_data_parsed = JSON.parse(uTask.task_data);
            } catch (e) {
              console.error("Failed to parse task_data", e);
            }
          }
          return {
            ...uTask,
            user_task_id: matchingUserTask?.id,
            status: (matchingUserTask?.status as 'To Do' | 'In Progress' | 'Completed') || 'To Do',
            task_data_parsed,
          };
        });
        setTasks(combinedTasks);
        if (combinedTasks.length > 0) {
          setSelectedTask(combinedTasks[0]);
        }
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        setError('Failed to load tasks.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]); // Re-fetch if user changes (e.g., logs in/out)

  const completeTask = async (universalTaskId: number) => {
    if (!user) {
      console.warn('User not logged in. Cannot complete task in backend.');
      return;
    }

    try {
      await invoke('complete_task', { taskId: universalTaskId, userId: user.id });
      // Update local state after successful backend call
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === universalTaskId ? { ...task, status: 'Completed' } : task
        )
      );
      // Also update selectedTask if it's the one being completed
      setSelectedTask(prevSelectedTask =>
        prevSelectedTask && prevSelectedTask.id === universalTaskId
          ? { ...prevSelectedTask, status: 'Completed' }
          : prevSelectedTask
      );
      console.log('Task completed and points awarded!');
    } catch (error) {
      console.error('Error completing task or awarding points:', error);
    }
  };

  if (loading) {
    return <div className="w-full flex h-full justify-center items-center text-white">Loading tasks...</div>;
  }

  if (error) {
    return <div className="w-full flex h-full justify-center items-center text-red-500">{error}</div>;
  }

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
              <h3 className="font-semibold">{task.title} (Level {task.level})</h3>
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
            <p className="text-lg font-semibold text-neutral-300 mb-2">Level: {selectedTask.level}</p>
            <p className="mb-4 text-neutral-300">{selectedTask.description}</p>
            {selectedTask.task_type === 'knowledge' ? (
              <>
                <div className="mb-6 p-4 bg-neutral-800 rounded-lg">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <FaBook />
                    <span>Learning Module</span>
                  </h3>
                  <p className="text-neutral-300">{selectedTask.learning_module}</p>
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
              </>
            ) : (
              <ActionTask task={selectedTask} onComplete={completeTask} />
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
