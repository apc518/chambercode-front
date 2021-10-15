// react
import React, { useState } from 'react';

// material-ui core
import { Button, Hidden, makeStyles } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import SideDrawer from './SideDrawer';

const useStyles = makeStyles((theme) => {
  return {
    root:{
      display: "flex"
    },
    page: {
      flexGrow: 1,
      height: "100vh"
    },
    menuToggleButton: {
      position: "fixed",
      left: 10,
      top: 10,
      minWidth: 10,
      zIndex: 2
    }
  }
});

export default function Layout({children}){
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  }
 
  return (
    <div className={classes.root}>
      {/* side drawer */}
      <SideDrawer mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle}/>

      <Hidden smUp implementation="css">
        <Button
          variant="outlined"
          color="secondary"
          className={classes.menuToggleButton}
          onClick={handleDrawerToggle}
        >
          <MenuIcon/>
        </Button>
      </Hidden>

      <div className={classes.page}>
        {children}
      </div>
    </div>
  )
}