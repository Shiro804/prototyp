import { Request, Response } from "express";
import * as workstationService from "../services/workstationService";

export const getWorkstationById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const workstation = await workstationService.getWorkstationById(id);
    res.json(workstation);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving workstation", error });
  }
};

export const createWorkstation = async (req: Request, res: Response) => {
  try {
    const newWorkstation = await workstationService.createWorkstation(req.body);
    res.status(201).json(newWorkstation);
  } catch (error) {
    res.status(500).json({ message: "Error creating workstation", error });
  }
};

export const updateWorkstation = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updatedWorkstation = await workstationService.updateWorkstation(
      id,
      req.body
    );
    res.json(updatedWorkstation);
  } catch (error) {
    res.status(500).json({ message: "Error updating workstation", error });
  }
};

export const deleteWorkstation = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await workstationService.deleteWorkstation(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting workstation", error });
  }
};
