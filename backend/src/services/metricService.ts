import { MetricType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllMetrics = async () => {
    return await prisma.metric.findMany();
};

export const getMetricById = async (id: number) => {
    return await prisma.metric.findUnique({
        where: { id },
    });
};

export const createMetric = async (data: { name: string; value: number; type: MetricType; metricTypeId: number; entityId: number }) => {
    return await prisma.metric.create({
        data,
    });
};

export const updateMetric = async (id: number, data: { name?: string; value?: number }) => {
    return await prisma.metric.update({
        where: { id },
        data,
    });
};

export const deleteMetric = async (id: number) => {
    return await prisma.metric.delete({
        where: { id },
    });
};
