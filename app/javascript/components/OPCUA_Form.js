import React from 'react';
import PropTypes from 'prop-types';
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
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import axios from 'axios';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


function createData(name, value,datatype, TimeStamp) {
    return { name, value, datatype,TimeStamp };
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
    { id: 'datatype', numeric: true, disablePadding: false, label: 'Data type'},
    { id: 'time', numeric: true, disablePadding: false, label: 'TimeStamp' },
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
    Text: {
        width: '65%'
    },
    Add: {
        height: '58px',
        marginLeft: "2%"
    },
    formControl: {
        width: '150px',
        marginLeft: '10px'
    }
}));
const tagList = []

export default function EnhancedTable(props) {

    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [selectedDatatype,setSelectedDatatype] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [rows, setRows] = React.useState({
        data: []
    });
    const [checkState, setCheckState] = React.useState({
        DM: true,
        DL: true
    })

    const [opcuaTag, setOpcuaTag] = React.useState("");
    const [datatype, setDatatype] = React.useState("");
    React.useEffect(() => {
        tagList.length = 0;
    }, []);

    //建立出Form 
    const MyDialog = () => {
        return (
            <div>
                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"加入Tag"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            可以選擇加Tag加入至監控區，或是資料記錄區
                </DialogContentText>
                        <div>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={checkState.DM} onChange={handleCheckBoxChange('DM')} />
                                }
                                label="加入資料監控"
                            />
                        </div>
                        <div>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={checkState.DL} onChange={handleCheckBoxChange('DL')} />
                                }
                                label="加入資料紀錄"
                            />
                        </div>

                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setOpen(false)}
                            color="primary">
                            取消
                </Button>
                        <Button
                            onClick={handleRestSubmit}
                            color="primary" autoFocus>
                            完成
                </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }


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
                            OPCUA Quick Browse
        </Typography>
                    )}

                {numSelected > 0 ? (
                    <Tooltip title="Add">
                        <IconButton aria-label="add"
                            onClick={() => setOpen(true)}
                        >
                            <AddCircleIcon />
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

    const handleCheckBoxChange = name => event => {
        setCheckState({ ...checkState, [name]: event.target.checked });
    }

    const handleRestSubmit = event => {
        //發送api到後端拆解
        event.preventDefault();
        const data = {
            data: selected,
            datatype:selectedDatatype,
            source: "OPCUA",
        }
  
        if (checkState.DM) {
            axios
                .post('/api/datagroup', data)
                .then(response => {
                    if (response.data.state == 200) {
                        alert("加入成功");
                    }
                    else {
                        alert("加入失敗");
                    }
                })
        }
        if (checkState.DL) {
            console.log("加入到資料蒐集");

            axios
                .get('/api/datagroup')
                .then(response => {
                    console.log(response);
                })
        }
    }

    //OPC UA Function
    const handleAddClick = event => {
        event.preventDefault();

        if (opcuaTag == '' || datatype == '') {
            alert("請輸入完整的Tag資訊");
            return;
        }
        //重複Tag驗證
        if (!tagList.includes(opcuaTag)) {
            axios
                .get(`/api/opcua/tagSearch`, {
                    params: {
                        opcuaTag: opcuaTag,
                        datatype: datatype
                    }
                })
                .then(response => {
                    if (response.data.state == 404) {
                        alert("檢查加入的Tag是否正確");
                    }
                    else {
                        var temp = rows.data;
                        temp.push(createData(response.data.data.name, response.data.data.value,response.data.data.datatype, response.data.data.timestamps))
                        if (response.status == 200) {

                            setRows({ data: temp })

                            tagList.push(opcuaTag);
                        }
                        else if (response.state == 400) {
                            alert("沒有設定opc ua ");
                        }
                        else if (response.state == 404) {
                            alert("Tag不正確或是資料型態有誤");
                        }
                        else {
                            alert("加入失敗");
                        }
                    }
                })
        }
        else {
            alert('已經有該Tag囉');
        }
    }

    const handleOPCUAChange = event => {
        setOpcuaTag(event.target.value);
    }
    const handleRequestSort = (event, property) => {
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const handleSelectAllClick = event => {
        if (event.target.checked) {
            const newSelecteds = rows.data.map(n => n.name);
            const newSelectedsDatatype = rows.data.map(n=>n.datatype);
            setSelected(newSelecteds);
            setSelectedDatatype(newSelectedsDatatype);
            return;
        }
        setSelected([]);
        setSelectedDatatype([]);
    };

    const handleClick = (event, name,datatype) => {
    
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        let newdatatypeSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
            newdatatypeSelected = newdatatypeSelected.concat(selectedDatatype, datatype);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
            newdatatypeSelected = newdatatypeSelected.concat(selectedDatatype.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
            newdatatypeSelected = newdatatypeSelected.concat(selectedDatatype.slice(0,-1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
            newdatatypeSelected = newdatatypeSelected.concat(
                selectedDatatype.slice(0,selectedIndex),
                selectedDatatype.slice(selectedIndex + 1),
            ); 
        }
        console.log(newSelected);
        console.log(newdatatypeSelected);
        setSelected(newSelected);
        setSelectedDatatype(newdatatypeSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleDatatypeChange = event => {
        setDatatype(event.target.value);
    }

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = event => {
        setDense(event.target.checked);
    };

    const isSelected = name => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.data.length - page * rowsPerPage);

    return (
        <div className={classes.root}>
            <span>
                <TextField
                    variant="outlined"
                    id="Tag name"
                    label="Tag name"
                    name="Tag name"
                    className={classes.Text}
                    onChange={handleOPCUAChange}
                />
            </span>
            <span>
                <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-helper-label">Data Type</InputLabel>
                    <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={datatype}
                        onChange={handleDatatypeChange}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={1}>float</MenuItem>
                        <MenuItem value={2}>boolean</MenuItem>
                        <MenuItem value={3}>short</MenuItem>
                        <MenuItem value={4}>long</MenuItem>
                    </Select>
                </FormControl>
            </span>
            <span>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.Add}
                    onClick={handleAddClick}
                >
                    Add
                    </Button>
            </span>
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
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.name);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={event => handleClick(event, row.name,row.datatype)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={index}
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
                                            <TableCell align="right">{row.datatype}</TableCell>
                                            <TableCell align="right">{row.TimeStamp}</TableCell>
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
            <span>
                <FormControlLabel
                    control={<Switch checked={dense} onChange={handleChangeDense} />}
                    label="調整padding"
                />
            </span>
            <span style={{ "float": "right" }}>
                OPCUA Server:{props.data.opcua_server}
            </span>
            <MyDialog />
        </div>
    );
}
