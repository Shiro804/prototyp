"use client";

import { ActionIcon, Flex, Stack, Title, Tooltip } from "@mantine/core";
import { Resource, Prisma } from "@prisma/client";
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

import { ResourceCreateInputSchema } from "@/prisma/generated/zod";
import { CrudTableProps, filterEditingColumns, useValidation } from "./Utils";

export function ResourcesTable({
    data,
    create,
    update,
    remove,
}: Readonly<
    CrudTableProps<
        Resource,
        Prisma.ResourceCreateInput,
        Prisma.ResourceUpdateInput
    >
>) {
    const { validationErrors, validate, resetValidationErrors } =
        useValidation<Resource>(ResourceCreateInputSchema);

    const columns = useMemo<MRT_ColumnDef<Resource>[]>(
        () => [
            {
                accessorKey: "id",
                header: "Id",
                enableEditing: false,
                // size: 80,
            },
            {
                accessorFn: (r) => r.createdAt?.toDateString(),
                header: "Created at",
                enableEditing: false,
            },
            {
                accessorFn: (r) => r.updatedAt?.toDateString(),
                header: "Updated at",
                enableEditing: false,
            },
            {
                accessorKey: "name",
                header: "Name",
                mantineEditTextInputProps: {
                    type: "text",
                    required: true,
                    error: validationErrors?.name,
                    onFocus: () => resetValidationErrors("name"),
                },
            },
            {
                accessorKey: "active",
                header: "Active",
                mantineEditTextInputProps: {
                    type: "boolean",
                    required: true,
                    error: validationErrors?.name,
                    onFocus: () => resetValidationErrors("name"),
                },
            },
            {
                accessorKey: "locationId",
                header: "Location Id",
                mantineEditTextInputProps: {
                    type: "number",
                    required: true,
                    error: validationErrors?.locationId,
                    onFocus: () => resetValidationErrors("locationId"),
                },
            },
            {
                accessorKey: "processStepId",
                header: "Process Step Id",
                mantineEditTextInputProps: {
                    type: "number",
                    required: true,
                    error: validationErrors?.processStepId,
                    onFocus: () => resetValidationErrors("processStepId"),
                },
            },

        ],
        [validationErrors, resetValidationErrors]
    );

    const handleCreate: MRT_TableOptions<Resource>["onCreatingRowSave"] = async ({
        values,
        exitCreatingMode,
    }) => {
        const valuesFiltered = filterEditingColumns(columns, values);

        if (!validate(valuesFiltered)) return;

        if (create) {
            await create(valuesFiltered as Prisma.ResourceCreateInput);
        }

        exitCreatingMode();
    };

    const handleUpdate: MRT_TableOptions<Resource>["onEditingRowSave"] = async ({
        values,
        table,
    }) => {
        const valuesFiltered = filterEditingColumns(columns, values);

        if (!validate(valuesFiltered)) return;

        if (update) {
            await update(values.id, valuesFiltered as Prisma.ResourceUpdateInput);
        }

        table.setEditingRow(null);
    };

    const handleDelete = async (data: MRT_Row<Resource>) => {
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
                <Title order={3}>Create New Resource</Title>
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
