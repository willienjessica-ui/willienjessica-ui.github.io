import React, { useState, useEffect } from 'react';
import { ListTodo, CheckSquare, Square, Plus, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { apiFetch } from '../lib/api';

interface Task {
  id: string;
  description: string;
  isCompleted: boolean;
  completedAt: string | null;
}

interface ContractChecklistProps {
  contractId: string;
  userRole: 'CLIENT' | 'PROVIDER';
}

export const ContractChecklist: React.FC<ContractChecklistProps> = ({ contractId, userRole }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [contractId]);

  const fetchTasks = async () => {
    try {
      const data = await apiFetch(`/api/contracts/${contractId}/tasks`);
      setTasks(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskDesc.trim() || isAdding) return;

    setIsAdding(true);
    setError(null);
    try {
      await apiFetch(`/api/contracts/${contractId}/tasks`, {
        method: 'POST',
        body: JSON.stringify({ description: newTaskDesc })
      });
      setNewTaskDesc('');
      await fetchTasks();
    } catch (err: any) {
      setError(err.message || 'Failed to add task');
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    try {
      await apiFetch(`/api/contracts/${contractId}/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify({ isCompleted: !currentStatus })
      });
      await fetchTasks();
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await apiFetch(`/api/contracts/${contractId}/tasks/${taskId}`, {
        method: 'DELETE'
      });
      await fetchTasks();
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border border-white/10 bg-[#0a0a1f]/60">
        <Loader2 className="h-6 w-6 animate-spin text-[#00f0ff]" />
      </div>
    );
  }

  const completedCount = tasks.filter(t => t.isCompleted).length;
  const progress = tasks.length === 0 ? 0 : (completedCount / tasks.length) * 100;

  return (
    <div className="rounded-xl border border-white/10 bg-[#0a0a1f]/60 p-6 backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[#00f0ff]">
          <ListTodo className="h-5 w-5" />
          <h2 className="text-[12px] font-black uppercase tracking-[0.4em]">CONTRACT CHECKLIST</h2>
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00f0ff]">
          {completedCount} / {tasks.length} COMPLETED
        </div>
      </div>

      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div 
          className="h-full rounded-full bg-gradient-to-r from-[#00f0ff] to-[#00b0ff] shadow-[0_0_14px_rgba(0,240,255,0.6)] transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-3 rounded-sm border border-[#ff00ff]/30 bg-[#ff00ff]/5 p-3 text-[#ff00ff]">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="text-[10px] font-bold uppercase tracking-[0.1em]">{error}</span>
        </div>
      )}

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="py-6 text-center text-[10px] uppercase tracking-[0.2em] text-white/40 italic">
            NO TASKS DEFINED YET
          </div>
        ) : (
          tasks.map((task) => (
            <div 
              key={task.id} 
              className={`group flex items-center justify-between rounded-lg border p-3 transition-colors ${
                task.isCompleted 
                  ? 'border-[#00f0ff]/20 bg-[#00f0ff]/5' 
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleTask(task.id, task.isCompleted)}
                  disabled={userRole === 'CLIENT' && task.isCompleted} // Clients can't uncheck if provider checked it (example rule)
                  className={`flex h-5 w-5 items-center justify-center rounded transition-colors ${
                    task.isCompleted 
                      ? 'text-[#00f0ff]' 
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  {task.isCompleted ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
                </button>
                <span className={`text-sm ${task.isCompleted ? 'text-white/60 line-through' : 'text-white'}`}>
                  {task.description}
                </span>
              </div>
              
              {userRole === 'CLIENT' && (
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="opacity-0 transition-opacity group-hover:opacity-100 text-white/40 hover:text-[#ff00ff]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {userRole === 'CLIENT' && (
        <form onSubmit={handleAddTask} className="mt-6 flex gap-2">
          <input
            type="text"
            value={newTaskDesc}
            onChange={(e) => setNewTaskDesc(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 rounded-md border border-white/10 bg-black/40 px-4 py-2 text-sm text-white focus:border-[#00f0ff] focus:outline-none"
          />
          <button
            type="submit"
            disabled={isAdding || !newTaskDesc.trim()}
            className="flex items-center justify-center rounded-md bg-[#00f0ff] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#0a0a1f] transition hover:bg-[#00d0ff] disabled:opacity-50"
          >
            {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            ADD
          </button>
        </form>
      )}
    </div>
  );
};
