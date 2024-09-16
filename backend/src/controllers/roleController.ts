import { Request, Response } from "express";
import * as roleService from "../services/roleService";

export const getAllRoles = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const roles = await roleService.getAllRoles();
    res.status(200).json(roles);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error processing request", error: error as Error });
  }
};

export const getRoleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const role = await roleService.getRoleById(id);
    if (role) {
      res.status(200).json(role);
    } else {
      res.status(404).json({ message: "Role not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving role.", error: error as Error });
  }
};

export const createRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newRole = await roleService.createRole(req.body);
    res.status(201).json(newRole);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const updatedRole = await roleService.updateRole(id, req.body);
    if (updatedRole) {
      res.status(200).json(updatedRole);
    } else {
      res.status(404).json({ message: "Role not found" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const deleted = await roleService.deleteRole(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Role not found" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
