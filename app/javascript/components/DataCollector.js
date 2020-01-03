import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles';
import SettingsIcon from '@material-ui/icons/Settings';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';

function createData(name, value, successed,time) {
  return { name, value, successed , time };
}

const useStyles = makeStyles(theme => ({
   icon: {
     width: '20px',
     height: '20px'
   }
}));

//由後端傳送props看是否寫入
export default function SwitchLabels() {
  const classes = useStyles();
  const [dataSaveOpen, setDataSaveOpen] = React.useState(false);

  const handleDataSwitchChange = event => {
    setDataSaveOpen(event.target.checked);
  }

  return (
    <div>
      <div style={{ "float": "right" }}>
        <SettingsIcon style = {{"width":"40px","height":"40px"}} onClick = {()=>console.log('chick')}/>
      </div>
      <div>
        <FormControlLabel style={{ "float": "right" }}
          control={
            <Switch checked={dataSaveOpen} onChange={handleDataSwitchChange} value="dataSaveCheck" />
          }
          label="啟動資料寫入"
        />
      </div>

    </div>
  );
}