import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.ts';
import * as contractService from './contract.service.ts';
import { logger } from '../../lib/logger.ts';

export const createContract = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { jobId, providerId, termsSnapshot } = req.body;
    const contract = await contractService.createContract(req.user.userId, jobId, providerId, termsSnapshot);
    res.status(201).json(contract);
  } catch (error: any) {
    res.status(400).json({ error: 'Contract creation failed', message: error.message });
  }
};

export const getContracts = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const contracts = await contractService.getContracts(req.user.userId, req.user.role);
    res.json(contracts);
  } catch (error: any) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getContractById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const contract = await contractService.getContractById(req.params.id, req.user.userId, req.user.role);
    res.json(contract);
  } catch (error: any) {
    res.status(404).json({ error: 'Not Found', message: error.message });
  }
};

export const updateContractStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const contract = await contractService.updateContractStatus(req.params.id, req.user.userId, req.body.status, req.user.role);
    res.json(contract);
  } catch (error: any) {
    res.status(400).json({ error: 'Status update failed', message: error.message });
  }
};

export const addEvidence = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const evidence = await contractService.addEvidence(req.params.id, req.user.userId, req.body);
    res.status(201).json(evidence);
  } catch (error: any) {
    res.status(400).json({ error: 'Evidence upload failed', message: error.message });
  }
};

export const getEvidence = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const evidence = await contractService.getEvidence(req.params.id, req.user.userId, req.user.role);
    res.json(evidence);
  } catch (error: any) {
    res.status(404).json({ error: 'Not Found', message: error.message });
  }
};

export const requestCompletion = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const contract = await contractService.updateContractStatus(req.params.id, req.user.userId, 'COMPLETED', req.user.role);
    res.json(contract);
  } catch (error: any) {
    res.status(400).json({ error: 'Completion request failed', message: error.message });
  }
};

export const approveCompletion = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const contract = await contractService.updateContractStatus(req.params.id, req.user.userId, 'COMPLETED', req.user.role);
    res.json(contract);
  } catch (error: any) {
    res.status(400).json({ error: 'Approval failed', message: error.message });
  }
};

export const rejectCompletion = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const contract = await contractService.updateContractStatus(req.params.id, req.user.userId, 'ACTIVE', req.user.role);
    res.json(contract);
  } catch (error: any) {
    res.status(400).json({ error: 'Rejection failed', message: error.message });
  }
};

export const initiateDispute = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const contract = await contractService.updateContractStatus(req.params.id, req.user.userId, 'DISPUTED', req.user.role);
    res.json(contract);
  } catch (error: any) {
    res.status(400).json({ error: 'Dispute failed', message: error.message });
  }
};

export const addTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const task = await contractService.addTask(req.params.id, req.user.userId, req.body.description);
    res.status(201).json(task);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to add task', message: error.message });
  }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const tasks = await contractService.getTasks(req.params.id, req.user.userId, req.user.role);
    res.json(tasks);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to fetch tasks', message: error.message });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const task = await contractService.updateTask(req.params.id, req.params.taskId, req.user.userId, req.user.role, req.body.isCompleted);
    res.json(task);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to update task', message: error.message });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    await contractService.deleteTask(req.params.id, req.params.taskId, req.user.userId);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to delete task', message: error.message });
  }
};
