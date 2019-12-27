import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import SaveIcon from '@material-ui/icons/Save';
import CheckIcon from '@material-ui/icons/Check';
import { green, red, purple } from '@material-ui/core/colors';

//bad code...
const useStyles = makeStyles(theme => ({
    Title: {
        borderBottom: "medium  solid #6495ED",
    },
    h1: {
        borderBottom: "medium  solid #6495ED",
    },
    Form: {
        marginLeft: "5%",
        marginRight: "5%"
    },
    ConfirmButton: {
        float: "right",
        marginTop: "2%",
        width: "170px"
    },
    TitlePadding: {
        paddingTop: "2%",
        borderBottom: "medium  solid #6495ED",
    }
}))



const ColorButtonMQTT = withStyles(theme => ({
    root: {
        color: theme.palette.getContrastText(purple[500]),
        backgroundColor: purple[900],

    },
}))(Button);

// color Change , bool:confirm , confirm = true = green , confirm = false = red
function colorChange(confirm, value) {
    if (confirm === true) {
        return green[value];
    }
    else {
        return red[value];
    }
}

export default function Index(props) {
    const classes = useStyles();
    const [rest, setRest] = React.useState("");
    const [opcua, setOpcua] = React.useState("");
    const [mycolor, setMyColor] = React.useState({
        rest: false,
        MQTT: false,
        opcua: false
    })
    //加入顏色變化button，作為資料驗證


    React.useEffect(() => {
        setRest(props.data.rest_server);
        setOpcua(props.data.opc_ua);
    }, []);

    const ColorButtonRest = withStyles(theme => ({
        root: {
            color: theme.palette.getContrastText(colorChange(mycolor.rest, 500)),
            backgroundColor: colorChange(mycolor.rest, 500),
            '&:hover': {
                backgroundColor: colorChange(mycolor.rest, 700),
            },
        },
    }))(Button);

    const ColorButtonOPCUA = withStyles(theme => ({
        root: {
            color: theme.palette.getContrastText(colorChange(mycolor.opcua, 500)),
            backgroundColor: colorChange(mycolor.opcua, 500),
            '&:hover': {
                backgroundColor: colorChange(mycolor.opcua, 700),
            },
        },
    }))(Button);

    const handleRestChange = event => {
        event.persist();
        setRest(event.target.value)
    }

    const handleOpcUAChange = event => {
        event.persist();
        setOpcua(event.target.value);
    }

    const handleRestConfirm = event => {
        event.preventDefault();
        if (rest != '') {
            axios
                .get(`/api/settings/rest`, {
                    params: {
                        rest: rest,
                    }
                })
                .then(response => {
                    if (response.data.state == 200) {
                        //alert('RestFul 驗證成功!');
                        setMyColor(oldValues => ({
                            ...oldValues,
                            rest: true
                        }))
                    }
                    else {
                        // alert('RestFul 驗證失敗，請檢查是否正確!');
                        setMyColor(oldValues => ({
                            ...oldValues,
                            rest: false
                        }))
                    }
                })
        }
        else {
            alert("Rest欄位不得為空");
        }
    }

    const handleOPCUAConfirm = event => {
        event.preventDefault();
        if (opcua != '') {
            axios
                .get(`/api/settings/OPCUA`, {
                    params: {
                        opcua: opcua,
                    }
                })
                .then(response => {
                    if (response.data.state == 200) {
                        //alert('OPCUA 驗證成功!');
                        setMyColor(oldValues => ({
                            ...oldValues,
                            opcua: true
                        }))
                    }
                    else {
                        //alert('OPCUA 驗證失敗，請檢查是否正確!');
                        setMyColor(oldValues => ({
                            ...oldValues,
                            opcua: false
                        }))
                    }
                })
        }
        else {
            alert("OPCUA欄位不得為空");
        }
    }

    const handleSettingClick = event => {
        event.preventDefault();
        if (opcua == '' && rest == '') {
            alert('必須輸入資料');
        }
        else {
            axios
                .get(`/api/settings/save`, {
                    params: {
                        opcua: opcua,
                        rest: rest,
                    }
                })
                .then(response => {
                    if(response.data.state == 200){
                        alert("修正成功");
                    }
                    else{
                        alert("修正失敗");
                    }
                })
        }
    }

    return (
        <div>
            <h1 className={classes.Title}>RestFul</h1>
            <form className={classes.Form} noValidate>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            id="RestFul Server"
                            label="RestFul Server"
                            name="RestFul Server"
                            value={rest}
                            onChange={handleRestChange}
                        />
                    </Grid>
                </Grid>
                <ColorButtonRest
                    style={{ "float": "right" }}
                    type="submit"
                    fullWidth
                    variant="contained"
                    className={classes.ConfirmButton}
                    startIcon={<CheckIcon />}
                    onClick={handleRestConfirm}
                >
                    驗證RestFul
                    </ColorButtonRest>
                <Grid container justify="flex-end">

                </Grid>
            </form>
            <h1 className={classes.TitlePadding}>MQTT</h1>
            <p>尚未實作</p>
            <h1 className={classes.TitlePadding}>OPC UA</h1>
            <form className={classes.Form} noValidate>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            id="OPC UA Server"
                            label="OPC UA Server"
                            name="OPC UA Server"
                            value={opcua}
                            onChange={handleOpcUAChange}
                        />
                    </Grid>
                </Grid>
                <ColorButtonOPCUA
                    style={{ "float": "right" }}
                    type="submit"
                    fullWidth
                    variant="contained"
                    className={classes.ConfirmButton}
                    startIcon={<CheckIcon />}
                    onClick={handleOPCUAConfirm}
                >
                    驗證OPC UA
                    </ColorButtonOPCUA>
                <Grid container justify="flex-end">
                    <Button
                        style={{ "marginTop": "5%" }}
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={handleSettingClick}
                    >
                        設定
                    </Button>
                </Grid>
            </form>
        </div>
    );
}