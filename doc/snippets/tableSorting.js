import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';

function MyTableComponent({ data }) {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  const sortedData = [...data].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    }
    return ''; // No arrow if it's not being sorted
  };

  return (
    <Box>
      <TableContainer component={Paper} sx={componentsStyles.paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell
                sx={componentsStyles.headerCell}
                onClick={() => requestSort('name')}
                style={{ cursor: 'pointer' }}>
                Name {getSortArrow('name')}
              </TableCell>
              <TableCell
                sx={componentsStyles.headerCell}
                onClick={() => requestSort('date')}
                style={{ cursor: 'pointer' }}>
                Date {getSortArrow('date')}
              </TableCell>
              <TableCell sx={componentsStyles.headerCell}>
                Location
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell sx={componentsStyles.tableCell}>{item.name}</TableCell>
                <TableCell sx={componentsStyles.tableCell}>{item.date}</TableCell>
                <TableCell sx={componentsStyles.tableCell}>{item.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default MyTableComponent;
