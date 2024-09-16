import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllTransportSystems = async () => {
    return await prisma.transportSystem.findMany();
};

export const getTransportSystemById = async (id: number) => {
    return await prisma.transportSystem.findUnique({
        where: { id },
    });
};

export const createTransportSystem = async (data: any) => {
    return await prisma.transportSystem.create({
        data,
    });
};

export const updateTransportSystem = async (id: number, data: any) => {
    return await prisma.transportSystem.update({
        where: { id },
        data,
    });
};

export const deleteTransportSystem = async (id: number) => {
    return await prisma.transportSystem.delete({
        where: { id },
    });
};
