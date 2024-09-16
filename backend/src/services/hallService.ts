import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllHalls = async () => {
    return await prisma.hall.findMany();
};

export const getHallById = async (id: number) => {
    return await prisma.hall.findUnique({
        where: { id },
    });
};

export const createHall = async (data: { name: string; location: string }) => {
    return await prisma.hall.create({
        data,
    });
};

export const updateHall = async (id: number, data: { name?: string; location?: string }) => {
    return await prisma.hall.update({
        where: { id },
        data,
    });
};

export const deleteHall = async (id: number) => {
    return await prisma.hall.delete({
        where: { id },
    });
};
