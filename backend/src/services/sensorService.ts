import { PrismaClient, SensorType } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllSensors = async () => {
    return await prisma.sensor.findMany();
};

export const getSensorById = async (id: number) => {
    return await prisma.sensor.findUnique({
        where: { id },
    });
};

export const createSensor = async (data: { name: string; type: SensorType; value: number; machine: { connect: { id: number } } }) => {
    return await prisma.sensor.create({
        data,
    });
};

export const updateSensor = async (id: number, data: { name?: string; type?: SensorType; value?: number }) => {
    return await prisma.sensor.update({
        where: { id },
        data,
    });
};

export const deleteSensor = async (id: number) => {
    return await prisma.sensor.delete({
        where: { id },
    });
};
