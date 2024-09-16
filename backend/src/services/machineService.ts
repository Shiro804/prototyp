import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllMachines = async () => {
    return await prisma.machine.findMany();
};

export const getMachineById = async (id: number) => {
    return await prisma.machine.findUnique({
        where: { id },
    });
};

export const createMachine = async (data: any) => {
    return await prisma.machine.create({
        data,
    });
};

export const updateMachine = async (id: number, data: any) => {
    return await prisma.machine.update({
        where: { id },
        data,
    });
};

export const deleteMachine = async (id: number) => {
    return await prisma.machine.delete({
        where: { id },
    });
};
