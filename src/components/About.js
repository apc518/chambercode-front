import React from 'react';
import { useHistory } from 'react-router-dom';

import {makeStyles, Card, CardActionArea, Container, Hidden, CardContent, Typography, Grid} from '@material-ui/core';

const useStyles = makeStyles({
    card: {
      transition: '0.2s',
      '&:hover': {
        transform: 'scale(1.04)',
      }
    }
});

export default function About(props){
    const history = useHistory();
    const classes = useStyles();

    const aboutPages = [
        {
            id: 0,
            title: "About Me",
            path: "/about/andy",
            color: "#00404a"
        },
        {
            id: 1,
            title: "About ChamberCode",
            path: "/about/chambercode",
            color: "#004a40"
        }
    ]

    return (
        <Container style={{paddingTop: 20}}>
            <Hidden smUp implementation="css">
                <br/><br/>
            </Hidden>
            <Grid container spacing={6}>
                {aboutPages.map(ap => (
                    <Grid item key={ap.id} xs={12} md={6}>
                        <Card className={classes.card} style={{background: ap.color}} elevation={0}>
                            <CardActionArea style={{height: 300}} onClick={() => {history.push(ap.path)}}>
                                <CardContent>
                                    <Typography align="center" variant="h3" color="primary">{ap.title}</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}