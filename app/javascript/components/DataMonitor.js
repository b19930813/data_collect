import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios'
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import FilterListIcon from '@material-ui/icons/FilterList';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
//component
import ErrorTag from "./ErrorTag"


function createData(id, name, value, source, time) {
  return { id, name, value, source, time };
}



function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
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

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Tag Name' },
  { id: 'value', numeric: true, disablePadding: false, label: 'Value' },
  { id: 'time', numeric: true, disablePadding: false, label: 'Time' },
  { id: 'source', numeric: true, disablePadding: false, label: 'Source' },
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={order}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  title: {
    flex: '1 1 100%',
  },
}));



const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  Botton:{
    height: '55px',
    marginLeft: '5px'
  },
  Text:{
    width:'90%'
  },
  Submit:{
    marginTop: '10px'
  }
}));

export default function RestFulForm(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('successed');
  const [selected, setSelected] = React.useState([]);
  const [selectedSource, setSelectedSource] = React.useState([]);
  const [selectedName, setSelectedName] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);
  const [writeValue,setWriteValue] = React.useState('');
  const [rows, setRows] = React.useState({
    data: []
  });

  React.useEffect(() => {
    var temp = [];
    var index = 0
    //加入是否為空值的判斷
    if (props.data) {
      //判斷是否有RestFul data
      if (props.data.readResults) {
        props.data.readResults.forEach(element => {
          temp.push(createData(index, element.id, element.v, 'RestFul', element.t));
          index++;
        })
      }
      if (props.data.opcua.opcua_tag) {
        props.data.opcua.opcua_tag.forEach(element => {
          temp.push(createData(index, element.Name, element.Value, 'OPCUA', element.time));
          index++;
        })
      }
    }
    setRows({ data: temp })
  }, []);

  const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const { numSelected } = props;

    return (
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        {numSelected > 0 ? (
          <Typography className={classes.title} color="inherit" variant="subtitle1">
            {numSelected} 筆資料被選擇
          </Typography>
        ) : (
            <Typography className={classes.title} variant="h6" id="tableTitle">
              Data Browser
          </Typography>
          )}

        {numSelected > 0 ? (
          <Tooltip title="刪除Tag">
            <IconButton
              aria-label="delete"
              onClick={handleTagDelete}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
            <Tooltip title="Filter list">
              <IconButton aria-label="filter list">
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          )}
      </Toolbar>
    );
  };

  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
  };

  const handleRequestSort = (event, property) => {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = rows.data.map(n => n.id);
      const newSelectedSource = rows.data.map(n => n.source);
      const newSelectedName = rows.data.map(n => n.name);
      setSelected(newSelecteds);
      setSelectedSource(newSelectedSource);
      setSelectedName(newSelectedName);
      return;
    }
    setSelected([]);
    setSelectedSource([]);
    setSelectedSource([]);
  };
  
  const handleWriteValue = event =>{
    setWriteValue(event.target.value);
  }

  const handleWriteClick = event =>{
    event.preventDefault();
    //打write tag api ，打到datagroup update 
    

  }

  const handleTagDelete = event => {
    //需要取得兩總資料 Tag Name 跟 Source
    axios
      .delete(`api/datagroup/deleteSelected`, { data: { name: selectedName, source: selectedSource } })
      .then(response => {
        if (response.data.state === 200) {
          var temp = rows.data.filter((row) => {
            var result = true;
            for (let i = 0; i < selectedName.length; i++) {
              //console.log(row.name == selectedName[i] && row.source == selectedSource[i]);
              if (row.name == selectedName[i] && row.source == selectedSource[i]) {
                result = true;
                return;
              }
            }
            return result;
          })
          setRows({ data: temp })
        }
        else {
          alert("刪除失敗");
        }
      }
      )

  }

  const handleClick = (event, index, name, source) => {
    const selectedIndex = selected.indexOf(index); //index為避免source不同Name相同
    let newSelected = [];
    let newSelectedSource = [];
    let newSelectedName = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, index);
      newSelectedSource = newSelectedSource.concat(selectedSource, source);
      newSelectedName = newSelectedName.concat(selectedName, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
      newSelectedSource = newSelectedSource.concat(selectedSource.slice(1));
      newSelectedName = newSelectedName.concat(selectedName.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
      newSelectedSource = newSelectedSource.concat(newSelectedSource.slice(0, -1));
      newSelectedName = newSelectedName.concat(newSelectedName.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
      newSelectedSource = newSelectedSource.concat(
        newSelectedSource.slice(0, selectedIndex),
        newSelectedSource.slice(selectedIndex + 1),
      );
      newSelectedName = newSelectedName.concat(
        selectedName.slice(0, selectedIndex),
        selectedName.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
    setSelectedSource(newSelectedSource);
    setSelectedName(newSelectedName);
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

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.data.length - page * rowsPerPage);

  const MyDialog = () => {
    return (
      <div>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">無法抓取的Tag</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <ErrorTag props={props.bad_tag} />
            </DialogContentText>

          </DialogContent>
          <DialogActions>

          </DialogActions>
        </Dialog>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.data.length}
            />
            <TableBody>
              {stableSort(rows.data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${row.id}`;

                  return (
                    <TableRow
                      hover
                      onClick={event => handleClick(event, row.id, row.name, row.source)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.value}</TableCell>
                      <TableCell align="right">{row.time}</TableCell>
                      <TableCell align="right">{row.source}</TableCell>
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
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={rows.data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          labelRowsPerPage="顯示筆數"
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="調整padding"
      />
      <Button
        variant="contained"
        color="secondary"
        style={{ "float": "right" }}
        onClick={() => setOpen(true)}
      >
        Error Tag
      </Button>
      <div className = {classes.Submit}>
        <TextField
          variant="outlined"
          id="Tag value"
          label="Tag value"
          name="Tag value"
          className={classes.Text}
          onChange={handleWriteValue}
        />
        <Button
          className = {classes.Botton}
          variant="contained"
          color="primary"
          onClick={handleWriteClick}
        >
          Write
      </Button>
      </div>

      <MyDialog />
    </div>
  );
}
