import React, { useEffect, useState } from 'react';
import { lighten, makeStyles } from '@material-ui/core/styles';

import { Formik, Form, ErrorMessage } from 'formik';
import clsx from 'clsx';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import classes  from './classes';
  
export class EnhancedTableToolbar extends React.PureComponent {
  
  render() {
    const { numSelected } = this.props;
  
    return (
        <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: numSelected > 0
        })}>
        {numSelected > 0 ? (
          <Typography className={classes.title} color='inherit' variant='subtitle1'>
            {numSelected} selected
          </Typography>
        ) : (
          <Typography className={classes.title} variant='h6' id='tableTitle'>
            Crawler
          </Typography>
        )}
  
        {numSelected > 0 ? (
          <Tooltip title='Delete'>
            <IconButton aria-label='delete'>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title='Filter list'>
            <IconButton aria-label='filter list'>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    )
  }
  
}
  