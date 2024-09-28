"use client";

import { ActionIcon, Flex, Stack, Title, Tooltip } from "@mantine/core";
import { Location, Prisma } from "@prisma/client";
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

import { LocationCreateInputSchema } from "@/prisma/generated/zod";
import { CrudTableProps, filterEditingColumns, useValidation } from "./Utils";

export function LocationsTable({
  data,
  create,
  update,
  remove,
}: Readonly<
  CrudTableProps<
    Location,
    Prisma.LocationCreateInput,
    Prisma.LocationUpdateInput
  >
>) {
  const { validationErrors, validate, resetValidationErrors } =
    useValidation<Location>(LocationCreateInputSchema);

  const columns = useMemo<MRT_ColumnDef<Location>[]>(
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
        accessorKey: "description",
        header: "Description",
        mantineEditTextInputProps: {
          type: "text",
          required: true,
          error: validationErrors?.description,
          onFocus: () => resetValidationErrors("description"),
        },
      },
    ],
    [validationErrors]
  );

  const handleCreate: MRT_TableOptions<Location>["onCreatingRowSave"] = async ({
    values,
    exitCreatingMode,
  }) => {
    const valuesFiltered = filterEditingColumns(columns, values);

    if (!validate(valuesFiltered)) return;

    if (create) {
      await create(valuesFiltered as Prisma.LocationCreateInput);
    }

    exitCreatingMode();
  };

  const handleUpdate: MRT_TableOptions<Location>["onEditingRowSave"] = async ({
    values,
    table,
  }) => {
    const valuesFiltered = filterEditingColumns(columns, values);

    if (!validate(valuesFiltered)) return;

    if (update) {
      await update(values.id, valuesFiltered as Prisma.LocationUpdateInput);
    }

    table.setEditingRow(null);
  };

  const handleDelete = async (data: MRT_Row<Location>) => {
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
        <Title order={3}>Create New User</Title>
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
