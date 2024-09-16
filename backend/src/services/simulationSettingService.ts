import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllSimulationSettings = async () => {
    return await prisma.simulationSetting.findMany();
};

export const getSimulationSettingById = async (id: number) => {
    return await prisma.simulationSetting.findUnique({
        where: { id },
    });
};

export const createSimulationSetting = async (data: any) => {
    return await prisma.simulationSetting.create({
        data,
    });
};

export const updateSimulationSetting = async (id: number, data: any) => {
    return await prisma.simulationSetting.update({
        where: { id },
        data,
    });
};

export const deleteSimulationSetting = async (id: number) => {
    return await prisma.simulationSetting.delete({
        where: { id },
    });
};
