import React from 'react';

import {makeStyles, Grid, Card, CardActionArea, CardMedia } from '@material-ui/core';

import Swal from 'sweetalert2';

const useStyles = makeStyles({
    card: {
        transition: '0.15s',
        '&:hover': {
            transform: 'scale(1.08)'
        }
    }
});

export default function LogoGrid({ logos, itemSize }){
    const classes = useStyles();

    if(!itemSize) itemSize = 100;

    return (
        <Grid container>
            {logos.map((logo, idx) => (
            <Grid item key={idx} xs={6} md={3}>  
                <Card
                    style={{
                        width: itemSize,
                        background: "none"
                    }}
                    className={classes.card}
                    elevation={0}
                >
                    <CardActionArea>
                        <CardMedia
                            style={{height: itemSize, width: itemSize}}
                            image={logo.src}
                            title={logo.title}
                            onClick={() => {
                                if("href" in logo && logo.href){
                                    window.open(logo.href);
                                }
                                else{
                                    Swal.fire("This link isn't available right now 😕 Try again later.")
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