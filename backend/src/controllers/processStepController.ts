import { Request, Response } from "express";
import * as processStepService from "../services/processStepService";

export const getProcessStepById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const processStep = await processStepService.getProcessStepById(id);
    res.status(200).json(processStep);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Error retrieving process step",
    });
  }
};

export const createProcessStep = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newProcessStep = await processStepService.createProcessStep(req.body);
    res.status(201).json(newProcessStep);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Error creating process step",
    });
  }
};

export const updateProcessStep = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const updatedProcessStep = await processStepService.updateProcessStep(
      id,
      req.body
    );
    res.status(200).json(updatedProcessStep);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Error updating process step",
    });
  }
};

export const deleteProcessStep = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    await processStepService.deleteProcessStep(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Error deleting process step",
    });
  }
};
