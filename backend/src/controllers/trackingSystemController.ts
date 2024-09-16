import { Request, Response } from "express";
import * as trackingRecordService from "../services/trackingSystemService";

export const getTrackingRecordById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const trackingRecord = await trackingRecordService.getTrackingRecordById(id);
        res.json(trackingRecord);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tracking record", error });
    }
};

export const createTrackingRecord = async (req: Request, res: Response) => {
    try {
        const trackingRecordData = req.body;
        const newTrackingRecord = await trackingRecordService.createTrackingRecord(trackingRecordData);
        res.status(201).json(newTrackingRecord);
    } catch (error) {
        res.status(500).json({ message: "Error creating tracking record", error });
    }
};

export const updateTrackingRecord = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const trackingRecordData = req.body;
        const updatedTrackingRecord = await trackingRecordService.updateTrackingRecord(id, trackingRecordData);
        res.json(updatedTrackingRecord);
    } catch (error) {
        res.status(500).json({ message: "Error updating tracking record", error });
    }
};

export const deleteTrackingRecord = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        await trackingRecordService.deleteTrackingRecord(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Error deleting tracking record", error });
    }
};
