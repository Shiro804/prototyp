import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllQualityChecks = async () => {
    return await prisma.qualityCheck.findMany();
};

export const getQualityCheckById = async (id: number) => {
    return await prisma.qualityCheck.findUnique({
        where: { id },
    });
};

export const createQualityCheck = async (data: any) => {
    return await prisma.qualityCheck.create({
        data,
    });
};

export const updateQualityCheck = async (id: number, data: any) => {
    return await prisma.qualityCheck.update({
        where: { id },
        data,
    });
};

export const deleteQualityCheck = async (id: number) => {
    return await prisma.qualityCheck.delete({
        where: { id },
    });
};
