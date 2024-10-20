"use client";

import { ActionIcon, Flex, Stack, Title, Tooltip } from "@mantine/core";
import { ProcessStep, Prisma } from "@prisma/client";
import { IconEdit, IconPlus, IconX } from "@tabler/icons-react";
import {
    MantineReactTable,
    MRT_ColumnDef,
    MRT_EditActionButtons,
    MRT_Row,
    MRT_TableOptions,
    useMantineReactTable,
} from "mantine-react-table";
import { useMemo } from "react";

import { ProcessStepCreateInputSchema } from "@/prisma/generated/zod";
import { CrudTableProps, filterEditingColumns, useValidation } from "./Utils";

export function ProcessStepsTable({
    data,
    create,
    update,
    remove,
}: Readonly<
    CrudTableProps<
        ProcessStep,
        Prisma.ProcessStepCreateInput,
        Prisma.ProcessStepUpdateInput
    >
>) {
    const { validationErrors, validate, resetValidationErrors } =
        useValidation<ProcessStep>(ProcessStepCreateInputSchema);

    const columns = useMemo<MRT_ColumnDef<ProcessStep>[]>(
        () => [
            {
                accessorKey: "id",
                header: "ID",
                enableEditing: false,
                // size: 80,
            },
            {
                accessorKey: "name",
                header: "Name",
                enableEditing: false,
                // size: 80,
            },
            {
                accessorFn: (r) => r.createdAt?.toDateString(),
                header: "Created At",
                enableEditing: false,
            },
            {
                accessorFn: (r) => r.updatedAt?.toDateString(),
                header: "Update At",
                enableEditing: false,
            },
            {
                accessorKey: "resourceId",
                header: "Resource ID",
                enableEditing: false,
            },
            {
                accessorKey: "inventoryId",
                header: "Inventory ID",
                enableEditing: false,
            },
            {
                accessorKey: "locationId",
                header: "Location ID",
                enableEditing: false,
            },
            {
                accessorKey: "recipeId",
                header: "Recipe ID",
                enableEditing: false,
            },
            {
                accessorKey: "inputSpeed",
                header: "Input Speed",
                enableEditing: false,
            },
            {
                accessorKey: "outputSpeed",
                header: "Output Speed",
                enableEditing: false,
            },
            {
                accessorKey: "status",
                header: "Status",
                enableEditing: false,
            },
        ],
        [validationErrors, resetValidationErrors]
    );

    const handleCreate: MRT_TableOptions<ProcessStep>["onCreatingRowSave"] = async ({
        values,
        exitCreatingMode,
    }) => {
        const valuesFiltered = filterEditingColumns(columns, values);

        if (!validate(valuesFiltered)) return;

        if (create) {
            await create(valuesFiltered as Prisma.ProcessStepCreateInput);
        }

        exitCreatingMode();
    };

    const handleUpdate: MRT_TableOptions<ProcessStep>["onEditingRowSave"] = async ({
        values,
        table,
    }) => {
        const valuesFiltered = filterEditingColumns(columns, values);

        if (!validate(valuesFiltered)) return;

        if (update) {
            await update(values.id, valuesFiltered as Prisma.ProcessStepUpdateInput);
        }

        table.setEditingRow(null);
    };

    const handleDelete = async (data: MRT_Row<ProcessStep>) => {
        if (remove) {
            await remove(data.original.id);
        }
    };

    const table = useMantineReactTable({
        columns,
        data,
        createDisplayMode: "modal",
        editDisplayMode: "row",
        enableEditing: true,
        enablePagination: false,
        enableBottomToolbar: false,
        getRowId: (row) => row.id.toString(),
        // mantineTableContainerProps: {
        //   style: {
        //     minHeight: "500px",
        //   },
        // },
        onCreatingRowCancel: () => resetValidationErrors(),
        onCreatingRowSave: handleCreate,
        onEditingRowCancel: () => resetValidationErrors(),
        onEditingRowSave: handleUpdate,
        renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
            <Stack>
                <Title order={3}>Create New ProcessStep</Title>
                {internalEditComponents}
                <Flex justify="flex-end" mt="xl">
                    <MRT_EditActionButtons variant="text" table={table} row={row} />
                </Flex>
            </Stack>
        ),
        renderRowActions: ({ row, table }) => (
            <Flex gap="md">
                <Tooltip label="Edit">
                    <ActionIcon onClick={() => table.setEditingRow(row)}>
                        <IconEdit />
                    </ActionIcon>
                </Tooltip>
                <Tooltip label="Delete">
                    <ActionIcon color="red" onClick={() => handleDelete(row)}>
                        <IconX />
                    </ActionIcon>
                </Tooltip>
            </Flex>
        ),
        renderTopToolbarCustomActions: ({ table }) => (
            <ActionIcon
                onClick={() => {
                    table.setCreatingRow(true);
                }}
            >
                <IconPlus />
            </ActionIcon>
        ),
        // state: {
        //   isLoading: isLoadingUsers,
        //   isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
        //   showAlertBanner: isLoadingUsersError,
        //   showProgressBars: isFetchingUsers,
        // },
    });

    return <MantineReactTable table={table} />;
}
