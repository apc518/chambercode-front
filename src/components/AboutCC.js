import React from 'react';

import {Container, Hidden, Typography} from '@material-ui/core';
import LogoGrid from './LogoGrid';

import {logos} from '../objects/logos';

const iconSize = 125;

export default function AboutMe(){
    return (
        <Container style={{paddingTop: 20}}>
            <Hidden mdUp implementation="css">
                <br/><br/>
            </Hidden>

            <Typography variant="h3">
                Welcome!
            </Typography>
            <Typography variant="subtitle1" gutterBottom>Click any logo to visit that technology's website</Typography><br/>

            <Typography variant="h5">ChamberCode is built with the MERN stack: MongoDB, Express, React, and Node</Typography><br/>

            <LogoGrid logos={logos.slice(0,4)} itemSize={iconSize}/><br/>

            <Typography style={{paddingBottom: 20}} variant="h5">
                Some really <i>sweet</i> libraries in use: Material-UI, p5.js, and SweetAlert2
            </Typography>

            <LogoGrid logos={logos.slice(4,7)} itemSize={iconSize}/><br/>

            <Typography style={{paddingBottom: 20}} variant="h5">
                ChamberCode itself is hosted (front and back) on Heroku, and most of the static sites within are hosted on Netlify.
            </Typography>

            <LogoGrid logos={logos.slice(7,9)} itemSize={iconSize}/><br/>
            
            <Typography style={{paddingBottom: 20}} variant="h5">
                I use git/GitHub for version control. You can click the GitHub icon to visit the repo for this site!
            </Typography>

            <LogoGrid logos={logos.slice(9,10)} itemSize={iconSize} />

        </Container>
    )
}