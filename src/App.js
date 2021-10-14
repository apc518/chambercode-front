import React from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import "./App.css";

import { createTheme, ThemeProvider} from '@material-ui/core';

import Home from './components/Home';
import AppList from './components/AppList';
import MiniApp from './components/MiniApp'
import About from './components/About';
import Layout from './components/Layout';
import AboutMe from './components/AboutMe';
import AboutCC from './components/AboutCC';

const theme = createTheme({
  typography:{
    fontFamily: "Trebuchet MS"
  },
  palette: {
    mode: "dark",
    primary: {
      main: '#fff',
      contrastText: '#fff'
    },
    secondary: {
      main: '#00cfcf'
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Layout>
          <Switch>
            <Route exact path="/">
              <Home/>
            </Route>
            
            <Route exact path="/music">
              <AppList category="music"/>
            </Route>
            <Route exact path="/music/:appid">
              <MiniApp category="music"/>
            </Route>

            <Route exact path='/games'>
              <AppList category="games"/>
            </Route>
            <Route exact path="/games/:appid">
              <MiniApp category="games" />
            </Route>

            <Route exact path="/math">
              <AppList category="math" />
            </Route>
            <Route exact path="/math/:appid">
              <MiniApp category="math"/>
            </Route>
            <Route exact path="/latex-matrix">
              <Redirect from="/latex-matrix" to="/math/latex-matrix" />
            </Route>
            <Route exact path="/about">
              <About/>
            </Route>

            <Route exact path="/about/andy">
              <AboutMe/>
            </Route>
            <Route exact path="/about/chambercode">
              <AboutCC/>
            </Route>
          </Switch>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
