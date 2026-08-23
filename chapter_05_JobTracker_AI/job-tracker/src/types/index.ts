export type JobStatus = 
  | "Saved" 
  | "Applied / Networking" 
  | "Screening" 
  | "Interviewing" 
  | "Offer" 
  | "Rejected";

export interface Job {
  id: string;
  companyName: string;
  role: string;
  url?: string;
  resumeUsed?: string;
  dateApplied: string;
  salary?: string;
  notes?: string;
  status: JobStatus;
  archived?: boolean;
}
