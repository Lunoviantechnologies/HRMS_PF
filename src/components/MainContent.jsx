import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { PieChart } from '@mui/x-charts/PieChart';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import CancelIcon from '@mui/icons-material/Cancel';

export default function MainContent() {

  const [selectedCard, setSelectedCard] = useState(0);

  const cards = [
    {
      id: 1,
      title: 'Total Employees',
      description: 100,
      icon: <PeopleIcon fontSize='large' color='primary' />
    },
    {
      id: 2,
      title: 'Present Employees',
      description: 75,
      icon: <CheckCircleIcon fontSize='large' color='success' />
    },
    {
      id: 3,
      title: 'Leave Employees',
      description: 15,
      icon: <BeachAccessIcon fontSize='large' color='warning' />
    },
    {
      id: 4,
      title: 'Absent Employees',
      description: 10,
      icon: <CancelIcon fontSize='large' color='error' />
    }
  ];

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    { field: 'age', headerName: 'Age', type: 'number', width: 90, align: 'left', headerAlign: 'left' },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    },
  ];

  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: 30 },
    { id: 6, lastName: 'Melisandre', firstName: 'Scroo', age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <div>
      <h1>Welcome to HR PROJECT</h1>
      <Box sx={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))', gap: 2 }}>
        {
          cards.map((card, index) => (
            <Card key={card.id}>
              <CardActionArea onClick={() => setSelectedCard(index)} data-active={selectedCard === index ? '' : undefined}
                sx={{ height: '100%', '&[data-active]': {backgroundColor: 'action.selected', '&:hover': { backgroundColor: 'action.selectedHover' }}}}>
                <CardContent sx={{ height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    {card.icon}
                    <Typography variant="b" component="div">
                      {card.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" align='right'>
                    {card.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
      </Box>

      <div className='mt-3'>
        <Card sx={{ padding: '10px', boxShadow: 4 }}>
          <h4 style={{ marginBottom: '16px', textAlign: 'center' }}>Employees Attendence</h4>
          <Paper sx={{ height: 400, width: '100%', marginTop: '20px' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              sx={{
                border: 0, boxShadow: 'none', '& .MuiDataGrid-cell': { borderRight: '1px solid rgba(224, 224, 224, 1)' }
              }}
            />
          </Paper>
        </Card>
      </div>

      <div className='mt-3'>
        <Card sx={{ padding: '10px', boxShadow: 4 }}>
          <h2>Piechart of Employees</h2>
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: 10, label: 'series A' },
                  { id: 1, value: 15, label: 'series B' },
                  { id: 2, value: 20, label: 'series C' },
                ],
              },
            ]}
            width={200} height={200}
          />
        </Card>
      </div>

    </div>
  );
}
