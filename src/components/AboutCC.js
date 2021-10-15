import React from 'react';

import {Container, Hidden, Typography} from '@material-ui/core';
import LogoGrid from './LogoGrid';

const logos = [
    {
        id: 0,
        src: "/assets/images/mongodb-icon.svg",
        title: "mongodb logo",
        href: "https://www.mongodb.com/"
    },
    {
        id: 1,
        src: "/assets/images/expressjs-icon.svg",
        title: "express js logo",
        href: "https://expressjs.com/"
    },
    {
        id: 2,
        src: "/assets/images/reactjs-icon.svg",
        title: "react js logo",
        href: "https://reactjs.org/"
    },
    {
        id: 3,
        src: "/assets/images/nodejs-icon.svg",
        title: "node js logo",
        href: "https://nodejs.org/"
    },
    {
        id: 4,
        src: "/assets/images/mui-icon.svg",
        title: "Material UI logo",
        href: "https://mui.com/"
    },
    {
        id: 5,
        src: "/assets/images/p5js-asterisk.svg",
        title: "p5js logo",
        href: "https://p5js.org/"
    },
    {
        id: 6,
        src: "/assets/images/swal2-icon.svg",
        title: "SweetAlert2 logo",
        href: "https://sweetalert2.github.io/"
    },
    {
        id: 7,
        src: "/assets/images/heroku-icon.svg",
        title: "Heroku logo",
        href: "https://www.heroku.com/"
    }
]

export default function AboutMe(){
    return (
        <Container style={{paddingTop: 20}}>
            <Hidden smUp implementation="css">
                <br/><br/>
            </Hidden>

            <Typography variant="h3">
                Welcome!
            </Typography>
            <Typography variant="subtitle1" gutterbottom>Click any logo to visit that technology's website</Typography><br/>

            <Typography variant="h5">ChamberCode is built with the MERN stack: MongoDB, Express, React, and Node</Typography><br/>

            <LogoGrid logos={logos.slice(0,4)}/><br/>

            <Typography style={{paddingBottom: 20}} variant="h5">
                Some really <i>sweet</i> libraries in use: Material-UI, p5.js, and SweetAlert2
            </Typography>

            <LogoGrid logos={logos.slice(4,7)}/><br/>

            <Typography style={{paddingBottom: 20}} variant="h5">
                Finally, the project is hosted (front and back) on Heroku!
            </Typography>

            <LogoGrid logos={logos.slice(7,8)}/>
        </Container>
    )
}