"use client";

import { Button, Table, TableData } from "@mantine/core";
import { IconEdit, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { ReactNode } from "react";

export interface Indexable {
  id: number;
}

export interface CrudTableProps<T extends Indexable> {
  header: ReactNode[];
  data: T[];
  props: (keyof T)[];
  editBaseUrl: string;
  onDelete?: (entity: T) => void;
  convertToString?: (keyof T)[];
}

export function CrudTable<T extends Indexable>({
  header,
  data,
  props,
  editBaseUrl,
  onDelete,
  convertToString = [],
}: Readonly<CrudTableProps<T>>) {
  const tableData: TableData = {
    head: [...header, "Edit", "Delete"],
    body: data.map((d) => [
      ...(props.map((p) => {
        if (convertToString.includes(p)) {
          return String(d[p]);
        } else {
          return d[p];
        }
      }) as JSX.Element[]),
      <Button
        key={d.id}
        component={Link}
        href={`${editBaseUrl}/${d.id}`}
        color="yellow"
      >
        <IconEdit />
      </Button>,
      <Button key={d.id} onClick={() => onDelete && onDelete(d)} color="red">
        <IconX />
      </Button>,
    ]),
  };

  return <Table data={tableData} />;
}
