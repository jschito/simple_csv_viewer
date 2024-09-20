import React, { useMemo } from "react";
import { useTable, useFilters } from "react-table";

// Default column filter function
const DefaultColumnFilter = ({ column: { filterValue, setFilter } }) => (
  <input
    value={filterValue || ""}
    onChange={(e) => setFilter(e.target.value || undefined)} // Set undefined to remove the filter entirely
    placeholder={`Search...`}
  />
);

// TablePreview component using react-table
const TablePreview = ({ headers, data, onFilterChange }) => {
  // Define the table columns
  const columns = useMemo(
    () =>
      headers.map((header) => ({
        Header: header,
        accessor: header, // Accessor matches the data key
        Filter: DefaultColumnFilter,
      })),
    [headers]
  );

  const tableInstance = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
    },
    useFilters // Add filtering functionality
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, setAllFilters } =
    tableInstance;

  // Apply filtering to chart
  React.useEffect(() => {
    const filteredData = rows.map((row) => row.original);
    onFilterChange(filteredData); // Send filtered data to parent component
  }, [rows, onFilterChange]);

  return (
    <div>
      <h2>CSV Data Preview with Filters</h2>
      {data.length > 0 ? (
        <div>
          <table {...getTableProps()} border="1" cellPadding="5" cellSpacing="0">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header")}
                      <div>{column.canFilter ? column.render("Filter") : null}</div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default TablePreview;
