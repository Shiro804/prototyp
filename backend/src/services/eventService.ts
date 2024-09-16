import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createEvent = async (data: any) => {
    return await prisma.event.create({
        data,
    });
};

export const getEventById = async (id: number) => {
    return await prisma.event.findUnique({
        where: { id },
    });
};

export const getAllEvents = async () => {
    return await prisma.event.findMany();
};

export const updateEvent = async (id: number, data: any) => {
    return await prisma.event.update({
        where: { id },
        data,
    });
};

export const deleteEvent = async (id: number) => {
    return await prisma.event.delete({
        where: { id },
    });
};
