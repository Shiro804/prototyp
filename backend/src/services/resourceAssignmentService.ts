import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllResourceAssignments = async () => {
    return await prisma.resourceAssignment.findMany();
};

export const getResourceAssignmentById = async (id: number) => {
    return await prisma.resourceAssignment.findUnique({
        where: { id },
    });
};

export const createResourceAssignment = async (data: any) => {
    return await prisma.resourceAssignment.create({
        data,
    });
};

export const updateResourceAssignment = async (id: number, data: any) => {
    return await prisma.resourceAssignment.update({
        where: { id },
        data,
    });
};

export const deleteResourceAssignment = async (id: number) => {
    return await prisma.resourceAssignment.delete({
        where: { id },
    });
};
