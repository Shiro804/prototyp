import { Request, Response } from "express";
import * as sensorService from "../services/sensorService";

export const getSensorById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const sensor = await sensorService.getSensorById(id);
    res.json(sensor);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving sensor", error });
  }
};

export const createSensor = async (req: Request, res: Response) => {
  try {
    const sensorData = req.body;
    const newSensor = await sensorService.createSensor(sensorData);
    res.status(201).json(newSensor);
  } catch (error) {
    res.status(500).json({ message: "Error creating sensor", error });
  }
};

export const updateSensor = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const sensorData = req.body;
    const updatedSensor = await sensorService.updateSensor(id, sensorData);
    res.json(updatedSensor);
  } catch (error) {
    res.status(500).json({ message: "Error updating sensor", error });
  }
};

export const deleteSensor = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await sensorService.deleteSensor(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting sensor", error });
  }
};
