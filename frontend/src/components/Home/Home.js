import React, { useEffect, useState } from 'react';
// import './Home.scss';
import agent from '../../agent/agent';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import Alert from '@material-ui/lab/Alert';
import {EnhancedTableToolbar} from "./Toolbar"
import EnhancedTableHead from "./TableHead"
import { Container, Grid, Button, TextField, InputLabel } from '@material-ui/core';
import Paginations from "./Paginations"
import classes  from './classes';
import {getSorting , stableSort , desc} from "./Helpers"
import Spinner from './Spinner';
const Home = () => {
  const [formValues, setFormValues] = useState([]);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [urlValue, setUrlValue] = React.useState('');
  const [errorUrl, setErrorsUrl] = React.useState(true);
  const [handleUrl, setHandleUrl] = React.useState(false);


  const callHistory = () => {
    agent.Crawler.getHistory()
      .then(res => {
        const newData = res.reverse();
        setFormValues(newData);
        return newData;
      })
      .catch(e => {});
  };

  React.useEffect(() => {
    callHistory();
  }, []);

  const handleNewScrawl = async () => {
    if (urlValue.includes('http')) {
      setErrorsUrl(false);
      setHandleUrl(false)
      // console.log('includes');
      const newData = await agent.Crawler.crawl(urlValue);
      console.log(newData, 'awdaw');
      setFormValues([...newData, ...formValues]);
    }else{
      setHandleUrl(true)
    }
    setErrorsUrl(true);
  };

  const handleChangeUrl = e => {
    e.preventDefault();
    setUrlValue(e.target.value);
  };
  const handleRequestSort = (event, property) => {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = formValues.map(n => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = event => {
    setDense(event.target.checked);
  };

  const isSelected = name => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, formValues.length - page * rowsPerPage);

  return (
    <div >
      <Container maxWidth='sm' style={{ marginTop: '150px' }} >
        <Grid container spacing={3}>
          <Grid item xs>
            <TextField onChange={handleChangeUrl} style={{ width: '100%' }} id='outlined-basic' label='Enter URL' variant='outlined' />
            <Grid item xs>
              <Button variant='contained' disabled={errorUrl === false} color='secondary' onClick={handleNewScrawl}>
                Scrawl
              </Button>
            </Grid>
            {handleUrl && <Alert severity='error'>Please provide a google url endpoint.</Alert>}
          </Grid>
        </Grid>
      </Container>
      <div className={classes.root}>

        <Paper className={classes.paper} style={{
      backgroundColor: errorUrl === false ? '#ddd' : '#fff'
    }}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <div className={classes.tableWrapper}>
            <Table className={classes.table} aria-labelledby='tableTitle' size={dense ? 'small' : 'medium'} aria-label='enhanced table'>
              <EnhancedTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={formValues.length}
              />
              
              <TableBody>
           {errorUrl === false && <Spinner />}   

                {stableSort(formValues, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row._id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        onClick={event => handleClick(event, row._id)}
                        role='checkbox'
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row._id}
                        selected={isItemSelected}>
                        <TableCell padding='checkbox'>
                          <Checkbox checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }} />
                        </TableCell>
                        <TableCell component='th' id={labelId} scope='row' padding='none'>
                          {row.title}
                        </TableCell>
                        <TableCell align='right'>{row.links}</TableCell>
                        <TableCell align='right'>{row.displayedLink}</TableCell>
                        <TableCell align='right'>{row.snippet}</TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={formValues.length}
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
          />
        </Paper>
        <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label='Dense padding' />
      </div>
    </div>
  );
};

export default Home;
