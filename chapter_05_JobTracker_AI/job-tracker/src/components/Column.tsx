import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Job } from '../types';
import JobCard from './JobCard';

interface ColumnProps {
  id: string;
  jobs: Job[];
  onEditJob: (job: Job) => void;
  onDeleteJob: (id: string) => void;
}

export default function Column({ id, jobs, onEditJob, onDeleteJob }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div 
      ref={setNodeRef} 
      className="flex-1 overflow-y-auto min-h-[150px] p-2 -mx-2 flex flex-col gap-3"
    >
      <SortableContext 
        id={id}
        items={jobs.map(j => j.id)} 
        strategy={verticalListSortingStrategy}
      >
        {jobs.map(job => (
          <JobCard 
            key={job.id} 
            job={job} 
            onEdit={() => onEditJob(job)}
            onDelete={() => onDeleteJob(job.id)}
          />
        ))}
      </SortableContext>
    </div>
  );
}
