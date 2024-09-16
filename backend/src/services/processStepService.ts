import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllProcessSteps = async () => {
    return await prisma.processStep.findMany();
};

export const getProcessStepById = async (id: number) => {
    return await prisma.processStep.findUnique({
        where: { id },
    });
};

export const createProcessStep = async (data: any) => {
    return await prisma.processStep.create({
        data,
    });
};

export const updateProcessStep = async (id: number, data: any) => {
    return await prisma.processStep.update({
        where: { id },
        data,
    });
};

export const deleteProcessStep = async (id: number) => {
    return await prisma.processStep.delete({
        where: { id },
    });
};
