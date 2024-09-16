import { Request, Response } from 'express';
import * as productionOrderService from '../services/productionOrderService';

export const getAllProductionOrders = async (req: Request, res: Response) => {
    try {
        const productionOrders = await productionOrderService.getAllProductionOrders();
        res.json(productionOrders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching production orders', error });
    }
};

export const getProductionOrderById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const productionOrder = await productionOrderService.getProductionOrderById(id);
        if (productionOrder) {
            res.json(productionOrder);
        } else {
            res.status(404).json({ message: 'Production order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching production order', error });
    }
};

export const createProductionOrder = async (req: Request, res: Response) => {
    try {
        const newProductionOrder = await productionOrderService.createProductionOrder(req.body);
        res.status(201).json(newProductionOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error creating production order', error });
    }
};

export const updateProductionOrder = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const updatedProductionOrder = await productionOrderService.updateProductionOrder(id, req.body);
        if (updatedProductionOrder) {
            res.json(updatedProductionOrder);
        } else {
            res.status(404).json({ message: 'Production order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating production order', error });
    }
};

export const deleteProductionOrder = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const deleted = await productionOrderService.deleteProductionOrder(id);
        if (deleted) {
            res.json({ message: 'Production order deleted successfully' });
        } else {
            res.status(404).json({ message: 'Production order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting production order', error });
    }
};