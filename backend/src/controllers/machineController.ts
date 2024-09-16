import { Request, Response } from "express";
import * as machineService from "../services/machineService";

export const getAllMachines = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const machines = await machineService.getAllMachines();
    res.status(200).json(machines);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving machines", error });
  }
};

export const getMachineById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const machine = await machineService.getMachineById(Number(req.params.id));
    if (machine) {
      res.status(200).json(machine);
    } else {
      res.status(404).json({ message: "Machine not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving machine", error });
  }
};

export const createMachine = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newMachine = await machineService.createMachine(req.body);
    res.status(201).json(newMachine);
  } catch (error) {
    res.status(500).json({ message: "Error creating machine", error });
  }
};

export const updateMachine = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedMachine = await machineService.updateMachine(
      Number(req.params.id),
      req.body
    );
    if (updatedMachine) {
      res.status(200).json(updatedMachine);
    } else {
      res.status(404).json({ message: "Machine not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating machine", error });
  }
};

export const deleteMachine = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedMachine = await machineService.deleteMachine(
      Number(req.params.id)
    );
    if (deletedMachine) {
      res.status(200).json({ message: "Machine deleted successfully" });
    } else {
      res.status(404).json({ message: "Machine not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting machine", error });
  }
};
