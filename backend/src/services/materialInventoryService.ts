import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllMaterials = async () => {
    return await prisma.materialInventory.findMany();
};

export const getMaterialById = async (id: number) => {
    return await prisma.materialInventory.findUnique({
        where: { id },
    });
};

export const createMaterial = async (data: any) => {
    return await prisma.materialInventory.create({
        data,
    });
};

export const updateMaterial = async (id: number, data: any) => {
    return await prisma.materialInventory.update({
        where: { id },
        data,
    });
};

export const deleteMaterial = async (id: number) => {
    return await prisma.materialInventory.delete({
        where: { id },
    });
};
