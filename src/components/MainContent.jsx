import React, { useEffect, useState } from 'react';
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
import axios from 'axios';
import backendIP from '../api';
import { useAuth } from '../context/AuthContext';

export default function MainContent() {

  const { token } = useAuth();
  const [allEmployeesList, setAllEmployeesList] = useState([]);
  const [selectedCard, setSelectedCard] = useState(0);
  const [attendanceData, setAttendanceData] = useState([]);
  const [absentEmployees, setAbsentEmployees] = useState([]);
  const [totalLeaveData, setTotalLeaveData] = useState([]);

  useEffect(() => {
    axios.get(`${backendIP}/api/attendance/all`, {
      headers: { Authorization: token },
    }).then(res => {
      const todaysAttendance = res.data.filter(record => {
        const recordDate = new Date(record.date);
        const today = new Date();
        return recordDate.getDate() === today.getDate() &&
          recordDate.getMonth() === today.getMonth() &&
          recordDate.getFullYear() === today.getFullYear();
      });

      const absentEmps = allEmployeesList.filter(emp => {
        return !todaysAttendance.some(att => att.employeeId === emp.id);
      });
      setAbsentEmployees(absentEmps);
      setAttendanceData(todaysAttendance);
    });

    axios.get(`${backendIP}/api/employees/all`, {
      headers: { Authorization: token },
    }).then(res => {
      // console.log(res.data);
      setAllEmployeesList(res.data);
    }).catch(err => console.log(err));

    axios.get(`${backendIP}/api/leaves`, {
      headers: {
        Authorization: token
      }
    }).then(res => {
      const today = new Date();
      const filteredLeave = res.data.filter(leave => {
        const from = new Date(leave.startDate);
        const to = new Date(leave.endDate);
        return today >= from && today <= to;
      });
      const uniqueEmpIds = [...new Set(filteredLeave.map(l => l.employeeId))];
      setTotalLeaveData(uniqueEmpIds.length);
    }).catch(err => console.log(err));

  }, [token]);

  const cards = [
    {
      id: 1,
      title: 'Total Employees',
      description: allEmployeesList.length,
      icon: <PeopleIcon fontSize='large' color='primary' />
    },
    {
      id: 2,
      title: 'Present Employees',
      description: attendanceData.length,
      icon: <CheckCircleIcon fontSize='large' color='success' />
    },
    {
      id: 3,
      title: 'Leave Employees',
      description: totalLeaveData,
      icon: <BeachAccessIcon fontSize='large' color='warning' />
    },
    {
      id: 4,
      title: 'Absent Employees',
      description: absentEmployees.length,
      icon: <CancelIcon fontSize='large' color='error' />
    }
  ];

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'employeeName', headerName: 'Employee Name', width: 200 },
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'inTime', headerName: 'In Time', width: 150 },
    { field: 'outTime', headerName: 'Out Time', width: 150 },
  ];

  const rows = attendanceData.map((att, index) => {
    const employee = allEmployeesList.find(emp => emp.id === att.employeeId);
    return {
      id: index + 1,
      employeeName: employee
        ? `${employee.firstName} ${employee.lastName}`
        : `Emp ID ${att.employeeId}`,
      date: new Date(att.date).toLocaleDateString(),
      status: att.status || 'Present',
      punchIn: att.punchIn ? new Date(att.punchIn).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }) : "N/A",
      punchOut: att.punchOut ? new Date(att.punchOut).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }) : "N/A",
    };
  });

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <div>
      <h1>Welcome to Lunovian</h1>
      <Box sx={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))', gap: 2 }}>
        {
          cards.map((card, index) => (
            <Card key={card.id} sx={{ boxShadow: 5 }}>
              <CardActionArea onClick={() => setSelectedCard(index)} data-active={selectedCard === index ? '' : undefined}
                sx={{ height: '100%', '&[data-active]': { backgroundColor: 'action.selected', '&:hover': { backgroundColor: 'action.selectedHover' } } }}>
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
          <h4 style={{ marginBottom: '16px', textAlign: 'center' }}>Today's Employees Attendence</h4>
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
                  { id: 0, value: allEmployeesList.length, label: 'Total' },
                  { id: 1, value: attendanceData.length, label: 'Present' },
                  { id: 2, value: totalLeaveData, label: 'Leave' },
                  { id: 3, value: absentEmployees.length, label: 'Absent' },
                ],
              },
            ]}
            width={200} height={200}
          />
        </Card>
      </div>

    </div>
  );
};
