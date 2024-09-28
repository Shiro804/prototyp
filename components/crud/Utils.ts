"use client";

import { MRT_ColumnDef, MRT_RowData } from "mantine-react-table";
import { useState } from "react";
import { z } from "zod";

export interface Indexable {
  id: number;
}

export interface CrudTableProps<T extends Indexable, CreateInput, UpdateInput> {
  data: T[];
  create?: (entity: CreateInput) => Promise<void>;
  update?: (id: number, entity: UpdateInput) => Promise<void>;
  remove?: (id: number) => Promise<void>;
}

export type ValidationErrors<T> = {
  [prop in keyof T]?: string[];
};

export function useValidation<T>(schema: z.ZodType) {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors<T>>(
    {}
  );

  const validate = (data: Partial<T>) => {
    const result = schema.safeParse(data);

    if (result.error) {
      setValidationErrors(result.error.flatten().fieldErrors);
      return false;
    }

    return true;
  };

  const resetValidationErrors = (key?: keyof T) => {
    if (key) {
      let newErrors = { ...validationErrors };
      newErrors[key] = undefined;
      setValidationErrors(newErrors);
    }
  };

  return { validationErrors, validate, resetValidationErrors };
}

export function filterEditingColumns<T extends MRT_RowData>(
  columns: MRT_ColumnDef<T>[],
  data: T
): Partial<T> {
  return columns
    .filter((c) => c.enableEditing === true || c.enableEditing === undefined)
    .map((c) => (console.log(c), c.accessorKey))
    .reduce<Partial<T>>((result, key) => {
      if (key && key in data) {
        result[key] = data[key];
      }
      return result;
    }, {});
}
