import React from 'react';
// import {Link} from 'react-router-dom';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Hidden } from '@material-ui/core';

import '../App.css';
import AppCard from './AppCard'

import getApps from '../objects/apps';

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

  let apps;

  switch (props.category){
    case 'games':
      apps = getApps().games;
      break;
    case 'music':
      apps = getApps().musicTools;
      break;
    case 'math':
      apps = getApps().mathTools;
      break;
    default:
      apps = []
      break;
  }

  return (
    <Container className={classes.container}>
      <Hidden mdUp implementation="css">
          <br/>
      </Hidden>
      <Grid container spacing={6}>
        {apps.map(app => (
          <Grid item key={app.id} xs={12} md={6}>
            <AppCard app={app} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};