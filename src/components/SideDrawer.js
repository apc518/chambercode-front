import React from 'react';
import {useHistory, useLocation} from 'react-router-dom';

import { Hidden, makeStyles } from '@material-ui/core';

import Avatar from '@material-ui/core/Avatar';
import Drawer from '@material-ui/core/Drawer';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import HomeIcon from '@material-ui/icons/Home';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import GamesIcon from '@material-ui/icons/Games';
import InfoIcon from '@material-ui/icons/Info';
import FunctionsIcon from '@material-ui/icons/Functions';

export const drawerWidth = 200;

const useStyles = makeStyles((theme) => {
  return {
    drawer: {
      width: drawerWidth
    },
    drawerPaper: {
      width: drawerWidth,
      backgroundColor: "#444"
    },
    active: {
      backgroundColor: "#666"
    },
    listText: {
      color: "#ddd"
    },
    logo: {
      width: theme.spacing(12),
      height: theme.spacing(12),
      padding: 0,
      alignSelf: "center"
    }
  }
});

export default function TestDrawer({mobileOpen, handleDrawerToggle}){
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  
  const menuItems = [
    {
      id: 0,
      path: "/",
      text: "Home",
      icon: <HomeIcon color="secondary"/>
    },
    {
      id: 1,
      path: "/music",
      text: "Music Tools",
      icon: <MusicNoteIcon color="secondary"/>
    },
    {
      id: 2,
      path: "/games",
      text: "Games",
      icon: <GamesIcon color="secondary"/>
    },
    {
      id: 3,
      path: "/math",
      text: "Math Tools",
      icon: <FunctionsIcon color="secondary"/>
    },
    {
      id: 4,
      path: "/about",
      text: "About",
      icon: <InfoIcon color="secondary"/>
    }
  ];

  const drawer = (
    <>
      <Avatar src="/assets/images/powerup-1.png" className={classes.logo}/>

      <List>
      {menuItems.map((item, idx) => (
          <ListItem 
          key={idx}
          button
          onClick={() => {
            history.push(item.path);
            if(mobileOpen){
              handleDrawerToggle();
            }
          }}
          className={location.pathname === item.path ? classes.active : null}
          >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText
              primary={item.text}
              className={classes.listText}  
          />
          </ListItem>
      ))}
      </List>
    </>
  )

  return (
    <>
    <Hidden mdUp implementation="css">
      <SwipeableDrawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onOpen={handleDrawerToggle}
        onClose={handleDrawerToggle}
        classes={{
          paper: classes.drawerPaper,
        }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {drawer}
      </SwipeableDrawer>
    </Hidden>
    <Hidden smDown implementation="css">
      <Drawer
        className={classes.drawer}
        variant="permanent"
        anchor="left"
        classes={{ paper: classes.drawerPaper}}
        open
      >
        {drawer}
      </Drawer>
    </Hidden>
    </>
  )
}