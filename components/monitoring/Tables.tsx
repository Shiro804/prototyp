// Tables.tsx
"use client";

import React from "react";
import {
    MantineReactTable,
    MRT_ColumnDef,
    MRT_TableOptions,
} from "mantine-react-table";

export interface UniversalTableProps<T extends object> {
    /** Array of data items to be displayed in the table */
    data: T[];
    /** Columns definition for mantine-react-table */
    columns: MRT_ColumnDef<T>[];
    /** Optionally pass in any extra MantineReactTable config props */
    tableOptions?: Partial<MRT_TableOptions<T>>;
    /** 
     * (Optional) A unique identifier for table rows, 
     * if you want to allow row selection or row expansion. 
     * Typically a field name in T, e.g. "id" 
     */
    getRowId?: (originalRow: T) => string;
}

/**
 * A universal Mantine React Table that can handle
 * arbitrary data with advanced features (sorting, filtering, column drag, etc.).
 *
 * Usage:
 *   <UniversalTable
 *     data={myData}
 *     columns={myColumnDefs}
 *     tableOptions={{ enableRowSelection: true, ... }}
 *     getRowId={(row) => String(row.id)}
 *   />
 */
export function UniversalTable<T extends object>({
    data,
    columns,
    tableOptions,
    getRowId,
}: UniversalTableProps<T>) {
    return (
        <MantineReactTable
            columns={columns}
            data={data}
            // Basic features turned on for demonstration:
            enableFilters
            enableSorting
            // Optionally pick up row identifiers, if needed
            getRowId={getRowId}
            // Merge in any other custom table options
            {...tableOptions}
            
        />
    );
}
