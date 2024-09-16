import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllProductionOrders = async () => {
    return await prisma.productionOrder.findMany();
};

export const getProductionOrderById = async (id: number) => {
    return await prisma.productionOrder.findUnique({
        where: { id },
    });
};

export const createProductionOrder = async (data: any) => {
    return await prisma.productionOrder.create({
        data,
    });
};

export const updateProductionOrder = async (id: number, data: any) => {
    return await prisma.productionOrder.update({
        where: { id },
        data,
    });
};

export const deleteProductionOrder = async (id: number) => {
    return await prisma.productionOrder.delete({
        where: { id },
    });
};
