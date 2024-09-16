import { Request, Response } from "express";
import * as metricService from "../services/metricService";

export const getMetricById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const metric = await metricService.getMetricById(id);
    res.status(200).json(metric);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? `Error fetching metric: ${error.message}`
          : "An unknown error occurred while fetching the metric",
    });
  }
};

export const createMetric = async (req: Request, res: Response) => {
  try {
    const newMetric = await metricService.createMetric(req.body);
    res.status(201).json(newMetric);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? `Error creating metric: ${error.message}`
          : "An unknown error occurred while creating the metric",
    });
  }
};

export const updateMetric = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updatedMetric = await metricService.updateMetric(id, req.body);
    res.status(200).json(updatedMetric);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? `Error updating metric: ${error.message}`
          : "An unknown error occurred while updating the metric",
    });
  }
};

export const deleteMetric = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await metricService.deleteMetric(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? `Error deleting metric: ${error.message}`
          : "An unknown error occurred while deleting the metric",
    });
  }
};
