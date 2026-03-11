import { useDataGrid, List } from "@refinedev/mui";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useNavigation } from "@refinedev/core";
import { Chip } from "@mui/material";

const columns: GridColDef[] = [
  {
    field: "name_hebrew",
    headerName: "שם מוצר",
    flex: 1,
    minWidth: 200,
  },
  {
    field: "price_min",
    headerName: "מחיר מינימלי",
    width: 120,
    renderCell: ({ value }) => (value ? `₪${value}` : "-"),
  },
  {
    field: "price_max",
    headerName: "מחיר מקסימלי",
    width: 120,
    renderCell: ({ value }) => (value ? `₪${value}` : "-"),
  },
  {
    field: "general_solution",
    headerName: "פתרון כללי",
    width: 180,
    renderCell: ({ value }) => value || "-",
  },
  {
    field: "is_active",
    headerName: "סטטוס",
    width: 100,
    renderCell: ({ value }) => (
      <Chip
        label={value ? "פעיל" : "לא פעיל"}
        color={value ? "success" : "default"}
        size="small"
      />
    ),
  },
];

export const ProductList = () => {
  const { edit } = useNavigation();
  const { dataGridProps } = useDataGrid({
    resource: "products",
    sorters: {
      initial: [{ field: "sort_order", order: "asc" }],
    },
    filters: {
      permanent: [{ field: "name", operator: "ne", value: "general" }],
    },
  });

  return (
    <List title="מוצרים">
      <DataGrid
        {...dataGridProps}
        columns={columns}
        autoHeight
        onRowClick={(params) => edit("products", params.id)}
        sx={{
          cursor: "pointer",
          "& .MuiDataGrid-row:hover": { bgcolor: "#f3e8ff" },
          direction: "rtl",
        }}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
      />
    </List>
  );
};
