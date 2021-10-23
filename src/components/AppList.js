import React from 'react';

import useScreenType from 'react-screentype-hook';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Hidden } from '@material-ui/core';

import '../App.css';
import AppCard from './AppCard'

import {apps} from '../objects/apps';

const useStyles = makeStyles((theme) => {
  return {
    container: {
      paddingTop: theme.spacing(6)
    },
    card: {
      height: "100%"
    }
  }
})

export default function AppList(props) {
  const classes = useStyles();
  const screenType = useScreenType();

  return (
    <Container className={classes.container}>
      <Hidden mdUp implementation="css">
          <br/>
      </Hidden>
      <Grid container spacing={6}>
        {apps[props.category].map(app => (
          <Grid item key={app.id} xs={12} md={6}>
            {!screenType.isMobile || app.mobileEnabled ? <AppCard app={app}/> : <></>}
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};