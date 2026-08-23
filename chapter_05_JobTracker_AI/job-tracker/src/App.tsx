import { useState, useEffect } from 'react';
import type { Job, JobStatus } from './types';
import { getJobs, addJob, updateJob, deleteJob } from './lib/db';
import Header from './components/Header';
import BoardView from './components/BoardView';
import TabularView from './components/TabularView';
import JobModal from './components/JobModal';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [view, setView] = useState<'board' | 'table'>('board');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const fetchedJobs = await getJobs();
    setJobs(fetchedJobs);
  };

  const handleAddOrEdit = async (jobData: Omit<Job, 'id' | 'dateApplied'> & { id?: string }) => {
    if (jobData.id) {
      // Editing
      const existingJob = jobs.find(j => j.id === jobData.id);
      if (existingJob) {
        const updated = { ...existingJob, ...jobData };
        await updateJob(updated);
      }
    } else {
      // Adding
      const newJob: Job = {
        ...jobData,
        id: uuidv4(),
        dateApplied: new Date().toISOString(),
      };
      await addJob(newJob);
    }
    await loadJobs();
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
      await deleteJob(id);
      await loadJobs();
    }
  };

  const handleDragEnd = async (jobId: string, newStatus: JobStatus) => {
    const job = jobs.find(j => j.id === jobId);
    if (job && job.status !== newStatus) {
      const updated = { ...job, status: newStatus };
      await updateJob(updated);
      setJobs(prev => prev.map(j => j.id === jobId ? updated : j));
    }
  };

  const filteredJobs = jobs.filter(job => 
    !job.archived && 
    (job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
     job.role.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col h-screen">
      <Header 
        view={view} 
        onViewChange={setView} 
        onAddJob={() => { setEditingJob(null); setIsModalOpen(true); }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <main className="flex-1 overflow-hidden p-6 flex flex-col">
        {view === 'board' ? (
          <BoardView 
            jobs={filteredJobs} 
            onJobUpdate={handleDragEnd}
            onEditJob={(job) => { setEditingJob(job); setIsModalOpen(true); }}
            onDeleteJob={handleDelete}
          />
        ) : (
          <TabularView 
            jobs={filteredJobs} 
            onEditJob={(job) => { setEditingJob(job); setIsModalOpen(true); }}
            onDeleteJob={handleDelete}
          />
        )}
      </main>

      {isModalOpen && (
        <JobModal 
          job={editingJob} 
          onClose={() => { setIsModalOpen(false); setEditingJob(null); }}
          onSubmit={handleAddOrEdit}
        />
      )}
    </div>
  );
}

export default App;
