import React from 'react';

import Grid from '@material-ui/core/Grid';
import {Card, CardMedia, Container, Hidden, Typography} from '@material-ui/core';

const logos = [
    {
        id: 0,
        path: "/assets/images/mongodb-icon.svg",
        title: "mongodb logo"
    },
    {
        id: 1,
        path: "/assets/images/expressjs-icon.svg",
        title: "express js logo"
    },
    {
        id: 2,
        path: "/assets/images/reactjs-icon.svg",
        title: "react logo"
    },
    {
        id: 3,
        path: "/assets/images/nodejs-icon.svg",
        title: "node js logo"
    }
]

export default function AboutMe(){
    return (
        <Container style={{paddingTop: 20}}>
            <Hidden smUp implementation="css">
                <br/><br/>
            </Hidden>

            <Typography variant="h3" gutterBottom>
                Welcome!
            </Typography>

            <Typography variant="h5">
                ChamberCode uses the MERN stack:
            </Typography>
            <br/>
            <Grid container>
                {logos.map(logo => (
                <Grid item key={logo.id} xs={6} md={3}>        
                    <Card
                        style={{width: 100, background: "none"}}
                        elevation={0}
                    >
                            <CardMedia
                                style={{height: 100, width: 100}}
                                image={logo.path}
                                title="react logo"
                            />
                    </Card>
                </Grid>
                ))}
            </Grid>
            <br/>
            <Typography variant="h5">
                The main UI library used is <a href="https://mui.com/" target="_blank" rel="noreferrer">Material-UI</a>.
            </Typography>
            <Typography variant="h5">
                There are several embedded pages, many of which use <a href="https://p5js.org/" target="_blank" rel="noreferrer">p5.js</a>.
            </Typography>
            <Typography style={{paddingBottom: 20}} variant="h5">
                I also employ <a href="https://sweetalert2.github.io/" target="_blank" rel="noreferrer">SweetAlert2</a> all over the site.
            </Typography>
        </Container>
    )
}