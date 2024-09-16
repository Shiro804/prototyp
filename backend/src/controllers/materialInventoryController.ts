import { Request, Response } from 'express';
import * as materialInventoryService from '../services/materialInventoryService';

export const getAllMaterials = async (req: Request, res: Response): Promise<void> => {
    try {
        const materials = await materialInventoryService.getAllMaterials();
        res.status(200).json(materials);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving materials', error });
    }
};

export const getMaterialById = async (req: Request, res: Response): Promise<void> => {
    try {
        const materialId = Number(req.params.id);
        const material = await materialInventoryService.getMaterialById(materialId);
        if (material) {
            res.status(200).json(material);
        } else {
            res.status(404).json({ message: 'Material not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving material', error });
    }
};

export const createMaterial = async (req: Request, res: Response): Promise<void> => {
    try {
        const newMaterial = req.body;
        const createdMaterial = await materialInventoryService.createMaterial(newMaterial);
        res.status(201).json(createdMaterial);
    } catch (error) {
        res.status(500).json({ message: 'Error creating material', error });
    }
};

export const updateMaterial = async (req: Request, res: Response): Promise<void> => {
    try {
        const materialId = Number(req.params.id);
        const materialUpdates = req.body;
        const updatedMaterial = await materialInventoryService.updateMaterial(materialId, materialUpdates);
        if (updatedMaterial) {
            res.status(200).json(updatedMaterial);
        } else {
            res.status(404).json({ message: 'Material not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating material', error });
    }
};

export const deleteMaterial = async (req: Request, res: Response): Promise<void> => {
    try {
        const materialId = Number(req.params.id);
        const deleted = await materialInventoryService.deleteMaterial(materialId);
        if (deleted) {
            res.status(200).json({ message: 'Material deleted successfully' });
        } else {
            res.status(404).json({ message: 'Material not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting material', error });
    }
};