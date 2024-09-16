import { Request, Response } from "express";
import * as hallService from "../services/hallService";

export const getHalls = async (req: Request, res: Response): Promise<void> => {
  try {
    const halls = await hallService.getAllHalls();
    res.status(200).json(halls);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving halls", error });
  }
};

export const getHallById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const hallId = Number(req.params.id);
    const hall = await hallService.getHallById(hallId);
    if (hall) {
      res.status(200).json(hall);
    } else {
      res.status(404).json({ message: "Hall not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving hall", error });
  }
};

export const createHall = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newHall = req.body;
    const createdHall = await hallService.createHall(newHall);
    res.status(201).json(createdHall);
  } catch (error) {
    res.status(500).json({ message: "Error creating hall", error });
  }
};

export const updateHall = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const hallId = Number(req.params.id);
    const hallUpdates = req.body;
    const updatedHall = await hallService.updateHall(hallId, hallUpdates);
    if (updatedHall) {
      res.status(200).json(updatedHall);
    } else {
      res.status(404).json({ message: "Hall not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating hall", error });
  }
};

export const deleteHall = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const hallId = Number(req.params.id);
    const deleted = await hallService.deleteHall(hallId);
    if (deleted) {
      res.status(200).json({ message: "Hall deleted successfully" });
    } else {
      res.status(404).json({ message: "Hall not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting hall", error });
  }
};
