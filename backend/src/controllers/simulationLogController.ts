import { Request, Response } from "express";
import * as simulationLogService from "../services/simulationLogService";

export const getSimulationLogById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const log = await simulationLogService.getSimulationLogById(id);
    res.json(log);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving simulation log", error });
  }
};

export const createSimulationLog = async (req: Request, res: Response) => {
  try {
    const newLog = await simulationLogService.createSimulationLog(req.body);
    res.status(201).json(newLog);
  } catch (error) {
    res.status(500).json({ message: "Error creating simulation log", error });
  }
};

export const updateSimulationLog = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updatedLog = await simulationLogService.updateSimulationLog(
      id,
      req.body
    );
    res.json(updatedLog);
  } catch (error) {
    res.status(500).json({ message: "Error updating simulation log", error });
  }
};

export const deleteSimulationLog = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await simulationLogService.deleteSimulationLog(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting simulation log", error });
  }
};
