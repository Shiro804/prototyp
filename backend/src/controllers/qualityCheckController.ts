import { Request, Response } from "express";
import * as qualityCheckService from "../services/qualityCheckService";

export const getQualityCheckById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const qualityCheck = await qualityCheckService.getQualityCheckById(id);
    res.json(qualityCheck);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quality check", error });
  }
};

export const createQualityCheck = async (req: Request, res: Response) => {
  try {
    const newQualityCheck = await qualityCheckService.createQualityCheck(
      req.body
    );
    res.status(201).json(newQualityCheck);
  } catch (error) {
    res.status(500).json({ message: "Error creating quality check", error });
  }
};

export const updateQualityCheck = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updatedQualityCheck = await qualityCheckService.updateQualityCheck(
      id,
      req.body
    );
    res.json(updatedQualityCheck);
  } catch (error) {
    res.status(500).json({ message: "Error updating quality check", error });
  }
};

export const deleteQualityCheck = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await qualityCheckService.deleteQualityCheck(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting quality check", error });
  }
};
