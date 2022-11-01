import TablePagination from '@material-ui/core/TablePagination';
import React, { useEffect, useState } from 'react';

const Paginations = (props)=>{
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [page, setPage] = React.useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };
   return(
   <TablePagination
    rowsPerPageOptions={[5, 10, 25]}
    component='div'
    count={props.data.length}
    rowsPerPage={rowsPerPage}
    page={page}
    backIconButtonProps={{
      'aria-label': 'previous page'
    }}
    nextIconButtonProps={{
      'aria-label': 'next page'
    }}
    onChangePage={handleChangePage}
    onChangeRowsPerPage={handleChangeRowsPerPage}
  /> )
}
export default Paginations