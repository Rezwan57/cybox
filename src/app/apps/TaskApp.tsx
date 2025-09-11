'use client'
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { FaTasks, FaCheckCircle, FaBook, FaExclamationTriangle, FaLock, FaTimesCircle } from 'react-icons/fa';
import { invoke } from '@tauri-apps/api/core';
import { useAuth } from '../../Context/AuthContext';
import { useNotification } from '../../Context/NotificationContext';
import { AppContext } from '../../Context/AppWrapper';

interface UniversalTask {
  id: number;
  title: string;
  description: string;
  learning_module: string | null;
  points: number;
  task_type: 'knowledge' | 'action';
  task_data: string | null;
  level: number;
}

interface UserTask {
  id: number;
  user_id: number;
  universal_task_id: number;
  status: string;
  completed_at: string | null;
  created_at: string;
}

interface DisplayTask extends UniversalTask {
  user_task_id?: number;
  status: 'To Do' | 'In Progress' | 'Completed';
  task_data_parsed?: any;
}

type TaskStatus = 'To Do' | 'In Progress' | 'Completed';

const toTaskStatus = (status: string | undefined): TaskStatus => {
  if (status === 'To Do' || status === 'In Progress' || status === 'Completed') {
    return status;
  }
  return 'To Do';
};


const MultiFactorChallenge = ({ task, onComplete }: { task: DisplayTask, onComplete: (taskId: number, points: number) => void }) => {
  const [passwords, setPasswords] = useState<string[]>(Array(5).fill(''));
  const [validation, setValidation] = useState<('correct' | 'incorrect' | 'empty')[]>(Array(5).fill('empty'));
  const correctPasswords = useMemo(() => task.task_data_parsed?.passwords || [], [task.task_data_parsed]);

  const handlePasswordChange = (index: number, value: string) => {
    const newPasswords = [...passwords];
    newPasswords[index] = value;
    setPasswords(newPasswords);

    const newValidation = [...validation];
    if (value === '') {
      newValidation[index] = 'empty';
    } else if (value === correctPasswords[index]) {
      newValidation[index] = 'correct';
    } else {
      newValidation[index] = 'incorrect';
    }
    setValidation(newValidation);
  };

  const allCorrect = validation.every(v => v === 'correct');

  return (
    <div>
      <p className="text-neutral-300 mb-4">Enter the 5 passwords to proceed.</p>
      <div className="space-y-4 mb-6">
        {passwords.map((password, index) => (
          <div key={index} className="flex items-center gap-2 relative">
            <input
              type="text"
              value={password}
              onChange={(e) => handlePasswordChange(index, e.target.value)}
              placeholder={`Password ${index + 1}`}
              className="flex-grow p-2 rounded-md border border-neutral-700 bg-neutral-800 text-white"
            />
            {validation[index] === 'correct' && <FaCheckCircle className="text-green-500 absolute top-[30%] right-3" />}
            {validation[index] === 'incorrect' && <FaTimesCircle className="text-red-500 absolute top-[30%] right-3" />}
          </div>
        ))}
      </div>
      {allCorrect && (
        <button
          onClick={() => onComplete(task.id, task.points)}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          Submit
        </button>
      )}
    </div>
  );
};

const ActionTask = ({ task, onComplete, isLocked, userId }: { task: DisplayTask, onComplete: (taskId: number, points: number) => void, isLocked: boolean, userId: number | undefined }) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    if (isLocked) {
        setError("Complete previous levels to unlock this task.");
        return;
    }
    if (!task.task_data_parsed) return;

    if (!userId) {
        setError("User not found.");
        return;
    }

    try {
      let result = false;
      if (task.title.includes('Crack the Password')) {
        result = await invoke('verify_password_crack', { password: inputValue });
      } else if (task.title.includes('Encrypt the Evidence')) {
        result = await invoke('verify_file_encryption', { filePath: task.task_data_parsed.file_path, userId });
      } else if (task.level === 6) {
        result = await invoke('verify_hidden_file', { content: inputValue });
      } else if (task.title.includes('Spotting Phishing Emails')) {
        result = await invoke('verify_email_classification', { userId });
      }

      if (result) {
        onComplete(task.id, task.points);
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
    if (task.level === 5) {
        return <MultiFactorChallenge task={task} onComplete={onComplete} />;
    }
    if (task.title.includes('Crack the Password')) {
      return <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Enter the password" className="w-full p-2 rounded-md border border-neutral-700 bg-neutral-800 text-white" />;
    } else if (task.title.includes('Encrypt the Evidence')) {
      return <p className="text-neutral-300">Click the button below when you have encrypted the file.</p>;
    } else if (task.level === 6) {
      return <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Enter the hidden message" className="w-full p-2 rounded-md border border-neutral-700 bg-neutral-800 text-white" />;
    } 
    return null;
  };

  return (
    <div>
      <div className="mb-4">{renderTaskInput()}</div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {task.status !== 'Completed' && task.level !== 5 && (
        <button
          onClick={handleSubmit}
          disabled={isLocked}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-neutral-600 disabled:cursor-not-allowed"
        >
          {isLocked ? <FaLock /> : null}
          <span>Submit</span>
        </button>
      )}
    </div>
  );
};

export default function TaskApp() {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const appContext = useContext(AppContext);
  
  const [tasks, setTasks] = useState<DisplayTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<DisplayTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);
      try {
        const universalTasks: UniversalTask[] = await invoke('get_universal_tasks');
        let userTasks: UserTask[] = [];
        userTasks = await invoke('get_user_tasks', { userId: user.id });

        const combinedTasks: DisplayTask[] = universalTasks.map(uTask => {
          const matchingUserTask = userTasks.find(ut => ut.universal_task_id === uTask.id);
          let task_data_parsed;
          if (uTask.task_data) {
            try { task_data_parsed = JSON.parse(uTask.task_data); } catch (e) { console.error("Failed to parse task_data", e); }
          }
          return {
            ...uTask,
            user_task_id: matchingUserTask?.id,
            status: toTaskStatus(matchingUserTask?.status),
            task_data_parsed,
          };
        });
        setTasks(combinedTasks);

        const firstIncomplete = combinedTasks.find(t => t.status !== 'Completed');
        if (firstIncomplete) {
            setSelectedTask(firstIncomplete);
        } else if (combinedTasks.length > 0) {
            setSelectedTask(combinedTasks[combinedTasks.length - 1]);
        }

      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        setError('Failed to load tasks.');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [user, appContext?.taskUpdateTrigger]);

  if (!appContext) {
    return null; 
  }

  const { openApp } = appContext;

  const completeTask = async (universalTaskId: number, points: number) => {
    if (!user) return;
    try {
      await invoke('complete_task', { taskId: universalTaskId, userId: user.id });
      const updatedTasks = tasks.map(task =>
        task.id === universalTaskId ? { ...task, status: 'Completed' as 'Completed' } : task
      );
      setTasks(updatedTasks);
      setSelectedTask(prev => (prev && prev.id === universalTaskId ? { ...prev, status: 'Completed' } : prev));
      showNotification('Task Complete!', points, () => openApp('Bank'));
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };


  const isLevelLocked = (level: number) => {
      if (level === 1) return false; 
      const prevLevelTasks = tasks.filter(t => t.level === level - 1);
      if (prevLevelTasks.length === 0) return false; 
      return !prevLevelTasks.every(t => t.status === 'Completed');
  }

  if (loading) return <div className="w-full flex h-full justify-center items-center text-white">Loading tasks...</div>;
  if (error) return <div className="w-full flex h-full justify-center items-center text-red-500">{error}</div>;

  return (
    <div className="w-full flex h-full text-white">
      <aside className="w-1/3 border-r border-neutral-700 overflow-y-auto">
        <div className="p-4 font-bold text-xl border-b border-neutral-700 flex items-center gap-2"><FaTasks /><span>Tasks</span></div>
        {tasks.map((task) => {
          const isLocked = isLevelLocked(task.level);
          return (
            <div
              key={task.id}
              onClick={() => !isLocked && setSelectedTask(task)}
              className={`px-4 py-3 border-b border-neutral-700 ${
                isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-neutral-800'
              } ${selectedTask?.id === task.id ? 'bg-neutral-800' : ''}`}
            >
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold ${task.status === 'Completed' ? 'line-through text-neutral-500' : ''}`}>{task.title} (Level {task.level})</h3>
                {isLocked ? <FaLock className="text-yellow-500" /> : task.status === 'Completed' ? <FaCheckCircle className="text-green-500" /> : <FaExclamationTriangle className="text-yellow-500" />}
              </div>
              <p className={`text-sm ${task.status === 'Completed' ? 'text-neutral-500' : 'text-neutral-400'}`}>__{task.status}__</p>
            </div>
          );
        })}
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        {selectedTask ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{selectedTask.title}</h2>
              <span className="text-lg font-semibold text-yellow-400">{selectedTask.points} Points</span>
            </div>
            <p className="text-lg font-semibold text-neutral-300 mb-2">Level: {selectedTask.level}</p>
            <p className="mb-4 text-neutral-300 select-text">{selectedTask.description}</p>
            
            {isLevelLocked(selectedTask.level) ? (
                <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 p-3 rounded-lg">
                    <FaLock />
                    <span>Complete all tasks from Level {selectedTask.level - 1} to unlock.</span>
                </div>
            ) : selectedTask.task_type === 'knowledge' ? (
              <>
                <div className="mb-6 p-4 bg-neutral-800 rounded-lg">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><FaBook /><span>Learning Module</span></h3>
                  <div className="text-neutral-300 prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedTask.learning_module || '' }} />
                </div>
                {selectedTask.status !== 'Completed' && (
                  <button
                    onClick={() => completeTask(selectedTask.id, selectedTask.points)}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaCheckCircle />
                    <span>Mark as Complete</span>
                  </button>
                )}
              </>
            ) : (
              <ActionTask task={selectedTask} onComplete={completeTask} isLocked={isLevelLocked(selectedTask.level)} userId={user?.id} />
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full"><p className="text-neutral-500">Select a task to view its details</p></div>
        )}
      </main>
    </div>
  );
}