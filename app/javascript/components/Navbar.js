import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import SideList from './SideList'

const useStyles = makeStyles(theme => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

const transPage =(page) =>{
    switch(page){
        case '首頁':
        document.location.href = "/";
        break;
        case '資料紀錄':
        //document.location.href = "/dataCollector"
        document.location.href = "#"
        break;
        case '資料管理':
        document.location.href = "/dataManager"
        break;
        case '設定':
        document.location.href = "/setting"
        break;
        case '資料監控':
        document.location.href = "/dataMonitor"
        break;
    }
}

export default function Navbar() {
    const classes = useStyles();
    const [state, setState] = React.useState({
        left: false,
    });

    const toggleDrawer = (side, open) => event => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [side]: open });
    };

    return (
        <div>
            <AppBar position="fixed" style={{ "backgroundColor": "#0066FF" }}>
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} onClick={toggleDrawer('left', true)} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title} onClick={() => { document.location.href = "/" }}>
                        Data Collector
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer open={state.left} onClose={toggleDrawer('left', false)}>
                <SideList
                    changePage={pageName => transPage(pageName)}
                    toggleDrawer={toggleDrawer}
                    side="left"
                />
            </Drawer>
        </div>
    );
}