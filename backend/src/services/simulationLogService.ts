import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createSimulationLog = async (data: any) => {
    return await prisma.simulationLog.create({
        data,
    });
};

export const getSimulationLogById = async (id: number) => {
    return await prisma.simulationLog.findUnique({
        where: { id },
    });
};

export const getAllSimulationLogs = async () => {
    return await prisma.simulationLog.findMany();
};

export const updateSimulationLog = async (id: number, data: any) => {
    return await prisma.simulationLog.update({
        where: { id },
        data,
    });
};

export const deleteSimulationLog = async (id: number) => {
    return await prisma.simulationLog.delete({
        where: { id },
    });
};
