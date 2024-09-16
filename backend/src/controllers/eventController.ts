import { Request, Response } from "express";
import * as eventService from "../services/eventService";

export const getAllEvents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const events = await eventService.getAllEvents();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
};

export const getEventById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const event = await eventService.getEventById(Number(req.params.id));
    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching event", error });
  }
};

export const createEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newEvent = await eventService.createEvent(req.body);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: "Error creating event", error });
  }
};

export const updateEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedEvent = await eventService.updateEvent(
      Number(req.params.id),
      req.body
    );
    if (updatedEvent) {
      res.status(200).json(updatedEvent);
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating event", error });
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedEvent = await eventService.deleteEvent(Number(req.params.id));
    if (deletedEvent) {
      res.status(200).json({ message: "Event deleted successfully" });
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error });
  }
};
