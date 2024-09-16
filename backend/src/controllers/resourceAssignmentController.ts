import { Request, Response } from "express";
import * as resourceAssignmentService from "../services/resourceAssignmentService";

export const getResourceAssignmentById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const resourceAssignment =
      await resourceAssignmentService.getResourceAssignmentById(id);
    res.json(resourceAssignment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching resource assignment", error });
  }
};

export const createResourceAssignment = async (req: Request, res: Response) => {
  try {
    const newResourceAssignment =
      await resourceAssignmentService.createResourceAssignment(req.body);
    res.status(201).json(newResourceAssignment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating resource assignment", error });
  }
};

export const updateResourceAssignment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updatedResourceAssignment =
      await resourceAssignmentService.updateResourceAssignment(id, req.body);
    res.json(updatedResourceAssignment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating resource assignment", error });
  }
};

export const deleteResourceAssignment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await resourceAssignmentService.deleteResourceAssignment(id);
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting resource assignment", error });
  }
};
