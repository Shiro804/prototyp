import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllRoles = async () => {
    return await prisma.role.findMany();
};

export const getRoleById = async (id: number) => {
    return await prisma.role.findUnique({
        where: { id },
    });
};

export const createRole = async (data: { name: string }) => {
    return await prisma.role.create({
        data,
    });
};

export const updateRole = async (id: number, data: { name?: string }) => {
    return await prisma.role.update({
        where: { id },
        data,
    });
};

export const deleteRole = async (id: number) => {
    return await prisma.role.delete({
        where: { id },
    });
};
