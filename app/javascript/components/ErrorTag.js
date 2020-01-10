import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
        width: 500,
    },
});

function createData(name, source) {
    return { name, source };
}



export default function ErrorTag(props) {
    const classes = useStyles();
    const [rows, setRows] = React.useState({
        data:[]
    });
    React.useEffect(() => {
       
        let temp = [];
        if(props.props.rest){
            props.props.rest.forEach(element=>{
                temp.push(createData(element,'rest'))
            })
        }
        if(props.props.opcua){
            props.props.opcua.forEach(element=>{
                temp.push(createData(element,'opcua'))
            })
        }
        setRows({data : temp});
    }, [])
    return (
        <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Tag Name</TableCell>
            <TableCell align="right">source</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.data.map((row,index) => (
            <TableRow key={index}>
              <TableCell  scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.source}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    );
}