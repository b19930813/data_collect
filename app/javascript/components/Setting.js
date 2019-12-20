import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import SaveIcon from '@material-ui/icons/Save';
import CheckIcon from '@material-ui/icons/Check';

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
export default function Index() {
    const classes = useStyles();
    const [rest, setRest] = React.useState("");
    const [opcua, setOpcua] = React.useState("");

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
        if(rest != ''){
        axios
            .get(`/api/settings/rest`, {
                params: {
                    rest: rest,
                }
            })
            .then(response => {
                if (response.data.state == 200) {
                    alert('RestFul 驗證成功!');
                }
                else {
                    alert('RestFul 驗證失敗，請檢查是否正確!');
                }
            })
        }
        else{
           alert("Rest欄位不得為空");
        }
    }

    const handleOPCUAConfirm = event => {
        event.preventDefault();
        if (opcua!= '') {
            axios
                .get(`/api/settings/OPCUA`, {
                    params: {
                        opcua: opcua,
                    }
                })
                .then(response => {
                    if (response.data.state == 200) {
                        alert('OPCUA 驗證成功!');
                    }
                    else {
                        alert('OPCUA 驗證失敗，請檢查是否正確!');
                    }
                })
        }
        else{
            alert("OPCUA欄位不得為空");
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
                            required
                            fullWidth
                            id="RestFul Server"
                            label="RestFul Server"
                            name="RestFul Server"
                            onChange={handleRestChange}
                        />
                    </Grid>
                </Grid>
                <Button
                    style={{ "float": "right" }}
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.ConfirmButton}
                    startIcon={<CheckIcon />}
                    onClick={handleRestConfirm}
                >
                    驗證RestFul
                    </Button>
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
                            required
                            fullWidth
                            id="OPC UA Server"
                            label="OPC UA Server"
                            name="OPC UA Server"
                            onChange={handleOpcUAChange}
                        />
                    </Grid>
                </Grid>
                <Button
                    style={{ "float": "right" }}
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.ConfirmButton}
                    startIcon={<CheckIcon />}
                    onClick={handleOPCUAConfirm}
                >
                    驗證OPC UA
                    </Button>
                <Grid container justify="flex-end">
                    <Button
                        style={{ "marginTop": "5%" }}
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                    //onClick={console.log('')}
                    >
                        設定
                    </Button>
                </Grid>
            </form>
        </div>
    );
}