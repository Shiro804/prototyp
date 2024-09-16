import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllUsers = async (): Promise<User[]> => {
    return await prisma.user.findMany();
};

export const getUserById = async (id: number): Promise<User | null> => {
    return await prisma.user.findUnique({
        where: { id },
    });
};

export const createUser = async (data: Omit<User, 'id'>): Promise<User> => {
    return await prisma.user.create({
        data,
    });
};

export const updateUser = async (id: number, data: Partial<User>): Promise<User> => {
    return await prisma.user.update({
        where: { id },
        data,
    });
};

export const deleteUser = async (id: number): Promise<User> => {
    return await prisma.user.delete({
        where: { id },
    });
};