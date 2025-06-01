"use client";

import { ActionIcon, Flex, Stack, Title, Tooltip } from "@mantine/core";
import { Machine, Prisma } from "@prisma/client";
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

import { MachineCreateInputSchema } from "@/prisma/generated/zod";
import { CrudTableProps, filterEditingColumns, useValidation } from "./Utils";

export function MachinesTable({
  data,
  create,
  update,
  remove,
}: Readonly<
  CrudTableProps<
    Machine,
    Prisma.MachineCreateInput,
    Prisma.MachineUpdateInput
  >
>) {
  const { validationErrors, validate, resetValidationErrors } =
    useValidation<Machine>(MachineCreateInputSchema);

  const columns = useMemo<MRT_ColumnDef<Machine>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Id",
        enableEditing: false,
        // size: 80,
      },
      {
        accessorKey: "resourceId",
        header: "Resource ID",
        enableEditing: false,
      },
    ],
    [validationErrors, resetValidationErrors]
  );

  const handleCreate: MRT_TableOptions<Machine>["onCreatingRowSave"] = async ({
    values,
    exitCreatingMode,
  }) => {
    const valuesFiltered = filterEditingColumns(columns, values);

    if (!validate(valuesFiltered)) return;

    if (create) {
      await create(valuesFiltered as Prisma.MachineCreateInput);
    }

    exitCreatingMode();
  };

  const handleUpdate: MRT_TableOptions<Machine>["onEditingRowSave"] = async ({
    values,
    table,
  }) => {
    const valuesFiltered = filterEditingColumns(columns, values);

    if (!validate(valuesFiltered)) return;

    if (update) {
      await update(values.id, valuesFiltered as Prisma.MachineUpdateInput);
    }

    table.setEditingRow(null);
  };

  const handleDelete = async (data: MRT_Row<Machine>) => {
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
    onCreatingRowCancel: () => resetValidationErrors(),
    onCreatingRowSave: handleCreate,
    onEditingRowCancel: () => resetValidationErrors(),
    onEditingRowSave: handleUpdate,
    renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Create New Machine</Title>
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
  });

  return <MantineReactTable table={table} />;
}
