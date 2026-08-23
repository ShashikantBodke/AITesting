import { Search, LayoutGrid, List, Filter, Plus, FileText, ExternalLink } from 'lucide-react';

interface HeaderProps {
  view: 'board' | 'table';
  onViewChange: (view: 'board' | 'table') => void;
  onAddJob: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Header({ view, onViewChange, onAddJob, searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Resume Dropdown (Visual Only) */}
        <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md text-sm font-medium text-blue-600 bg-blue-50">
          <FileText className="w-4 h-4" />
          <span>Master_Resume</span>
        </div>
        
        {/* Connect LinkedIn */}
        <a 
          href="https://www.linkedin.com/jobs/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-[#0a66c2] text-white rounded-md text-sm font-medium hover:bg-[#004182] transition-colors"
        >
          <ExternalLink className="w-4 h-4 fill-current" />
          <span>Connect LinkedIn</span>
        </a>
      </div>

      <div className="flex items-center gap-4">
        {/* View Toggles */}
        <div className="flex items-center bg-gray-100 p-1 rounded-md">
          <button
            onClick={() => onViewChange('board')}
            className={`p-1.5 rounded-sm flex items-center justify-center ${view === 'board' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewChange('table')}
            className={`p-1.5 rounded-sm flex items-center justify-center ${view === 'table' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-blue-500 w-64"
          />
        </div>

        {/* Filters */}
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>

        {/* Add Job */}
        <button
          onClick={onAddJob}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add a Job</span>
        </button>
      </div>
    </header>
  );
}
