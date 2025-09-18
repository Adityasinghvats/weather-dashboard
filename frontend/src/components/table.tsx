import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';

interface DataRow {
    id: number;
    year: string;
    rainfall: string;
    temperature: string;
    humidity: string;
}

const columns: GridColDef<DataRow>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'year',
        headerName: 'Year',
        width: 150,
        editable: true,
    },
    {
        field: 'rainfall',
        headerName: 'Rainfall(mm/hr)',
        width: 150,
        editable: true,
    },
    {
        field: 'temperature',
        headerName: 'Temperature(°C)',
        width: 110,
        editable: true,
    },
    {
        field: 'humidity',
        headerName: 'Humidity(%)',
        width: 110,
        editable: true,
    },
];

interface DataTableProps {
    data: DataRow[];
}

export default function DataTable({ data }: DataTableProps) {
    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={data}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    );
}
