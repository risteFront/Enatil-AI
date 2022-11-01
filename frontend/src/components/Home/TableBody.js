import TableBody from '@material-ui/core/TableBody';

const body = (props) => {
  //  const [order, setOrder] = React.useState('asc');

    const isSelected = name => props.selected.indexOf(name) !== -1;
    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
    
        if (selectedIndex === -1) {
          newSelected = newSelected.concat(props.selected, name);
        } else if (selectedIndex === 0) {
          newSelected = newSelected.concat(props.selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
          newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
          newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
    
        setSelected(newSelected);
      };
    function getSorting(order, orderBy) {
        return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
      }
    function stableSort(array, cmp) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
          const order = cmp(a[0], b[0]);
          if (order !== 0) return order;
          return a[1] - b[1];
        });
        return stabilizedThis.map(el => el[0]);
      }
  return (
    <TableBody>
      {stableSort(formValues, getSorting(props.order, props.orderBy))
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
  );
};
export default body
