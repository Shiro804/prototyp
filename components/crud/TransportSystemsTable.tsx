"use client";

import { ActionIcon, Flex, Stack, Title, Tooltip } from "@mantine/core";
import { TransportSystem, Prisma } from "@prisma/client";
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

import { TransportSystemCreateInputSchema } from "@/prisma/generated/zod";
import { CrudTableProps, filterEditingColumns, useValidation } from "./Utils";

export function TransportSystemsTable({
  data,
  create,
  update,
  remove,
}: Readonly<
  CrudTableProps<
  TransportSystem,
    Prisma.TransportSystemCreateInput,
    Prisma.TransportSystemUpdateInput
  >
>) {
  const { validationErrors, validate, resetValidationErrors } =
    useValidation<TransportSystem>(TransportSystemCreateInputSchema);

  const columns = useMemo<MRT_ColumnDef<TransportSystem>[]>(
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
        accessorKey: "inputSpeed",
        header: "Input Speed",
        mantineEditTextInputProps: {
          type: "number",
          required: true,
          error: validationErrors?.inputSpeed,
          onFocus: () => resetValidationErrors("inputSpeed"),
        },
      },
      {
        accessorKey: "outputSpeed",
        header: "Output Speed",
        mantineEditTextInputProps: {
          type: "number",
          required: true,
          error: validationErrors?.outputSpeed,
          onFocus: () => resetValidationErrors("outputSpeed"),
        },
      },
      {
        accessorKey: "inventoryId",
        header: "Inventory ID",
        mantineEditTextInputProps: {
          type: "number",
          required: true,
          error: validationErrors?.inventoryId,
          onFocus: () => resetValidationErrors("inventoryId"),
        },
      },
      {
        accessorKey: "startStepId",
        header: "Start Step ID",
        mantineEditTextInputProps: {
          type: "number",
          required: true,
          error: validationErrors?.startStepId,
          onFocus: () => resetValidationErrors("startStepId"),
        },
      },
      {
        accessorKey: "endStepId",
        header: "End Step ID",
        mantineEditTextInputProps: {
          type: "number",
          required: true,
          error: validationErrors?.endStepId,
          onFocus: () => resetValidationErrors("endStepId"),
        },
      },
    ],
    [validationErrors, resetValidationErrors]
  );

  const handleCreate: MRT_TableOptions<TransportSystem>["onCreatingRowSave"] = async ({
    values,
    exitCreatingMode,
  }) => {
    const valuesFiltered = filterEditingColumns(columns, values);

    if (!validate(valuesFiltered)) return;

    if (create) {
      await create(valuesFiltered as Prisma.TransportSystemCreateInput);
    }

    exitCreatingMode();
  };

  const handleUpdate: MRT_TableOptions<TransportSystem>["onEditingRowSave"] = async ({
    values,
    table,
  }) => {
    const valuesFiltered = filterEditingColumns(columns, values);

    if (!validate(valuesFiltered)) return;

    if (update) {
      await update(values.id, valuesFiltered as Prisma.TransportSystemUpdateInput);
    }

    table.setEditingRow(null);
  };

  const handleDelete = async (data: MRT_Row<TransportSystem>) => {
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
        <Title order={3}>Create New Transport System</Title>
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
    )
  });

  return <MantineReactTable table={table} />;
}
