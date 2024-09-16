import { Request, Response } from "express";
import * as transportSystemService from "../services/transportSystemService";

export const getTransportSystemById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const transportSystem = await transportSystemService.getTransportSystemById(
      id
    );
    res.json(transportSystem);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transport system", error });
  }
};

export const createTransportSystem = async (req: Request, res: Response) => {
  try {
    const newTransportSystem =
      await transportSystemService.createTransportSystem(req.body);
    res.status(201).json(newTransportSystem);
  } catch (error) {
    res.status(500).json({ message: "Error creating transport system", error });
  }
};

export const updateTransportSystem = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updatedTransportSystem =
      await transportSystemService.updateTransportSystem(id, req.body);
    res.json(updatedTransportSystem);
  } catch (error) {
    res.status(500).json({ message: "Error updating transport system", error });
  }
};

export const deleteTransportSystem = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await transportSystemService.deleteTransportSystem(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting transport system", error });
  }
};
