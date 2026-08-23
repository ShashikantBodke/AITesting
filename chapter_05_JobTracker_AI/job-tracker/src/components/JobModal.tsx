import { useState, useEffect } from 'react';
import type { Job, JobStatus } from '../types';
import { X } from 'lucide-react';

interface JobModalProps {
  job: Job | null;
  onClose: () => void;
  onSubmit: (jobData: Omit<Job, 'id' | 'dateApplied'> & { id?: string }) => void;
}

const STATUS_OPTIONS: JobStatus[] = [
  "Saved",
  "Applied / Networking",
  "Screening",
  "Interviewing",
  "Offer",
  "Rejected"
];

const RESUME_OPTIONS = ["Master_Resume", "SDE_Resume_v3", "QA_Lead_Resume", "Frontend_Resume_v2"];

export default function JobModal({ job, onClose, onSubmit }: JobModalProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    url: '',
    resumeUsed: '',
    salary: '',
    notes: '',
    status: 'Saved' as JobStatus,
  });

  useEffect(() => {
    if (job) {
      setFormData({
        companyName: job.companyName,
        role: job.role,
        url: job.url || '',
        resumeUsed: job.resumeUsed || '',
        salary: job.salary || '',
        notes: job.notes || '',
        status: job.status,
      });
    }
  }, [job]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: job?.id,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {job ? 'Edit Job' : 'Add New Job'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
            <input 
              required
              type="text" 
              value={formData.companyName}
              onChange={e => setFormData({...formData, companyName: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-blue-500 outline-none"
              placeholder="e.g. Google"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
            <input 
              required
              type="text" 
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-blue-500 outline-none"
              placeholder="e.g. Senior Frontend Engineer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
            <select
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value as JobStatus})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-blue-500 outline-none"
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
            <input 
              type="url" 
              value={formData.url}
              onChange={e => setFormData({...formData, url: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-blue-500 outline-none"
              placeholder="https://linkedin.com/jobs/view/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resume Used</label>
            <select
              value={formData.resumeUsed}
              onChange={e => setFormData({...formData, resumeUsed: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-blue-500 outline-none"
            >
              <option value="">Select a resume...</option>
              {RESUME_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
            <input 
              type="text" 
              value={formData.salary}
              onChange={e => setFormData({...formData, salary: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-blue-500 outline-none"
              placeholder="e.g. $150k - $180k"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea 
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-blue-500 outline-none resize-none h-24"
              placeholder="Recruiter info, referral links, etc."
            />
          </div>
          
          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              {job ? 'Save Changes' : 'Add Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
