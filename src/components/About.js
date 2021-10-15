import React from 'react';

import {Container, Hidden, Typography} from '@material-ui/core';
import { Link } from 'react-router-dom';

export default function About(props){
    return (
        <Container style={{paddingTop: 20}}>
            <Hidden smUp implementation="css">
                <br/><br/>
            </Hidden>
            <Typography variant="h3" align="center">
                <Link to="/about/andy">Andy</Link><br/>
                <Link to="/about/chambercode">ChamberCode</Link>
            </Typography>
        </Container>
    )
}