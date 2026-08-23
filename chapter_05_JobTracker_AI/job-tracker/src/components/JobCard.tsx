import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Job } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { MoreVertical, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface JobCardProps {
  job: Job;
  onEdit: () => void;
  onDelete: () => void;
}

export default function JobCard({ job, onEdit, onDelete }: JobCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const daysSinceApplied = formatDistanceToNow(new Date(job.dateApplied), { addSuffix: true });

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-3 rounded-md shadow-sm border border-gray-100 flex flex-col gap-2 relative group"
    >
      <div className="flex justify-between items-start cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
        <div>
          <h4 className="font-semibold text-gray-900 text-sm leading-tight">{job.role}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{job.companyName}</p>
        </div>
      </div>

      <div className="absolute top-2 right-2">
        <button 
          onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
          className="p-1 rounded hover:bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 shadow-lg rounded-md z-10 w-32 py-1">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); onEdit(); }} 
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 flex items-center gap-2"
            >
              <Pencil className="w-3 h-3" /> Edit
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); onDelete(); }} 
              className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          {job.resumeUsed && (
            <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded font-medium border border-gray-200">
              {job.resumeUsed}
            </span>
          )}
          {job.url && (
            <a 
              href={job.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
              onClick={e => e.stopPropagation()}
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
        <span className="text-[10px] text-gray-400 font-medium">
          {daysSinceApplied}
        </span>
      </div>
    </div>
  );
}
