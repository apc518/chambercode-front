import React from 'react';

import {makeStyles, Grid, Card, CardActionArea, CardMedia } from '@material-ui/core';

const useStyles = makeStyles({
    card: {
        transition: '0.15s',
        '&:hover': {
            transform: 'scale(1.08)'
        }
    }
});

export default function LogoGrid({logos}){
    const classes = useStyles();

    return (
        <Grid container>
            {logos.map(logo => (
            <Grid item key={logo.id} xs={6} md={3}>        
                <Card
                    style={{
                        width: 100,
                        background: "none"
                    }}
                    className={classes.card}
                    elevation={0}
                >
                    <CardActionArea>
                        <CardMedia
                            style={{height: 100, width: 100}}
                            image={logo.src}
                            title={logo.title}
                            onClick={() => {
                                if("href" in logo){
                                    window.open(logo.href);
                                }
                            }}
                        />
                    </CardActionArea>
                </Card>
            </Grid>
            ))}
        </Grid>
    )
}