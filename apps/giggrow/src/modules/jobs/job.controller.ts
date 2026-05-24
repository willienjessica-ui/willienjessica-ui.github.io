import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.ts';
import * as jobService from './job.service.ts';
import { logger } from '../../lib/logger.ts';

export const createJob = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const job = await jobService.createJob(req.user.userId, req.body);
    res.status(201).json(job);
  } catch (error: any) {
    res.status(400).json({ error: 'Creation failed', message: error.message });
  }
};

export const getJobs = async (req: AuthRequest, res: Response) => {
  try {
    const filters = req.query;
    const jobs = await jobService.getJobs(filters);
    res.json(jobs);
  } catch (error: any) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getJobById = async (req: AuthRequest, res: Response) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    res.json(job);
  } catch (error: any) {
    res.status(404).json({ error: 'Not Found', message: error.message });
  }
};

export const updateJob = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const job = await jobService.updateJob(req.params.id, req.user.userId, req.body);
    res.json(job);
  } catch (error: any) {
    res.status(400).json({ error: 'Update failed', message: error.message });
  }
};

export const updateJobStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const job = await jobService.updateJobStatus(req.params.id, req.user.userId, req.body.status, req.user.role);
    res.json(job);
  } catch (error: any) {
    res.status(400).json({ error: 'Status update failed', message: error.message });
  }
};

export const applyToJob = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const application = await jobService.applyToJob(req.params.id, req.user.userId, req.body);
    res.status(201).json(application);
  } catch (error: any) {
    res.status(400).json({ error: 'Application failed', message: error.message });
  }
};

export const getJobApplications = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const applications = await jobService.getJobApplications(req.params.id, req.user.userId, req.user.role);
    res.json(applications);
  } catch (error: any) {
    res.status(400).json({ error: 'Fetch failed', message: error.message });
  }
};

export const acceptApplication = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const application = await jobService.updateApplicationStatus(req.params.applicationId, req.user.userId, 'ACCEPTED');
    res.json(application);
  } catch (error: any) {
    res.status(400).json({ error: 'Action failed', message: error.message });
  }
};

export const rejectApplication = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const application = await jobService.updateApplicationStatus(req.params.applicationId, req.user.userId, 'REJECTED');
    res.json(application);
  } catch (error: any) {
    res.status(400).json({ error: 'Action failed', message: error.message });
  }
};
