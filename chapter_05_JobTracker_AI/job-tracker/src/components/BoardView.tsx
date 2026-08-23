import { useMemo } from 'react';
import type { Job, JobStatus } from '../types';
import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import Column from './Column';

interface BoardViewProps {
  jobs: Job[];
  onJobUpdate: (jobId: string, newStatus: JobStatus) => void;
  onEditJob: (job: Job) => void;
  onDeleteJob: (id: string) => void;
}

const COLUMNS: { id: JobStatus; label: string; color: string }[] = [
  { id: 'Saved', label: 'SAVED', color: '#94a3b8' },
  { id: 'Applied / Networking', label: 'APPLIED / NETWORKING', color: '#fbbf24' },
  { id: 'Screening', label: 'SCREENING', color: '#38bdf8' },
  { id: 'Interviewing', label: 'INTERVIEWING', color: '#3b82f6' },
  { id: 'Offer', label: 'OFFER', color: '#10b981' },
  { id: 'Rejected', label: 'REJECTED', color: '#ef4444' },
];

export default function BoardView({ jobs, onJobUpdate, onEditJob, onDeleteJob }: BoardViewProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      }
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const jobId = active.id as string;
    const overId = over.id as string;

    // Check if dragging over a column directly or over a card
    const targetStatus = COLUMNS.find(c => c.id === overId)?.id || 
                         jobs.find(j => j.id === overId)?.status;

    if (targetStatus) {
      onJobUpdate(jobId, targetStatus as JobStatus);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 h-full overflow-x-auto pb-4">
        {COLUMNS.map(col => {
          const columnJobs = jobs.filter(j => j.status === col.id);
          return (
            <div key={col.id} className="min-w-[320px] w-[320px] bg-[#f8f9fc] rounded-md flex flex-col h-full shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                  <h3 className="text-xs font-bold text-gray-500 tracking-wider">{col.label}</h3>
                </div>
                <span className="text-xs font-medium text-gray-400">{columnJobs.length}</span>
              </div>
              
              <div 
                className="w-full h-1 mb-4 rounded-full opacity-50" 
                style={{ backgroundColor: col.color }} 
              />
              
              <Column 
                id={col.id} 
                jobs={columnJobs} 
                onEditJob={onEditJob}
                onDeleteJob={onDeleteJob}
              />
            </div>
          );
        })}
      </div>
    </DndContext>
  );
}
