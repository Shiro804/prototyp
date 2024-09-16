import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllWorkstations = async () => {
    return await prisma.workstation.findMany();
};

export const getWorkstationById = async (id: number) => {
    return await prisma.workstation.findUnique({
        where: { id },
    });
};

export const createWorkstation = async (data: any) => {
    return await prisma.workstation.create({
        data,
    });
};

export const updateWorkstation = async (id: number, data: any) => {
    return await prisma.workstation.update({
        where: { id },
        data,
    });
};

export const deleteWorkstation = async (id: number) => {
    return await prisma.workstation.delete({
        where: { id },
    });
};
