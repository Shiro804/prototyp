import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createTrackingRecord = async (data: any) => {
    return await prisma.trackingSystem.create({
        data,
    });
};

export const getTrackingRecordById = async (id: number) => {
    return await prisma.trackingSystem.findUnique({
        where: { id },
    });
};

export const getAllTrackingRecords = async () => {
    return await prisma.trackingSystem.findMany();
};

export const updateTrackingRecord = async (id: number, data: any) => {
    return await prisma.trackingSystem.update({
        where: { id },
        data,
    });
};

export const deleteTrackingRecord = async (id: number) => {
    return await prisma.trackingSystem.delete({
        where: { id },
    });
};
