import React from 'react';
import Button from '@material-ui/core/Button';
import ActionCable from 'actioncable';

export default function Index() {
    return (
        <div>
            <h1>React</h1>
            <Button variant="contained" color="primary">
                Hello World
            </Button>
        </div>
    );
}