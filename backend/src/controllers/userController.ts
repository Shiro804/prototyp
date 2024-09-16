import { Request, Response } from "express";
import * as userService from "../services/userService";

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await userService.getUserById(Number(req.params.id));
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedUser = await userService.updateUser(
      Number(req.params.id),
      req.body
    );
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedUser = await userService.deleteUser(Number(req.params.id));
    if (deletedUser) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
