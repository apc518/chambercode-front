// react
import React from 'react';

// material-ui core
import { makeStyles } from '@material-ui/core';

import SideDrawer from './SideDrawer';

const useStyles = makeStyles((theme) => {
  return {
    root:{
      display: "flex"
    },
    page: {
      width: '100%',
      flexGrow: 1,
    }
  }
});

export default function Layout({children}){
  const classes = useStyles();
 
  return (
    <div className={classes.root}>
      {/* side drawer */}
      <SideDrawer/>

      <div className={classes.page}>
        {children}
      </div>
    </div>
  )
}