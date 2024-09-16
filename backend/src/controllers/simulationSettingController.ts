import { Request, Response } from "express";
import * as simulationSettingService from "../services/simulationSettingService";

export const getSimulationSettingById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const setting = await simulationSettingService.getSimulationSettingById(id);
    res.json(setting);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching simulation setting", error });
  }
};

export const createSimulationSetting = async (req: Request, res: Response) => {
  try {
    const newSetting = await simulationSettingService.createSimulationSetting(
      req.body
    );
    res.status(201).json(newSetting);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating simulation setting", error });
  }
};

export const updateSimulationSetting = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updatedSetting =
      await simulationSettingService.updateSimulationSetting(id, req.body);
    res.json(updatedSetting);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating simulation setting", error });
  }
};

export const deleteSimulationSetting = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await simulationSettingService.deleteSimulationSetting(id);
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting simulation setting", error });
  }
};
