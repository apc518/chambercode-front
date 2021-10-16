import React from 'react';

import {Container, Hidden, Typography} from '@material-ui/core';
import LogoGrid from './LogoGrid';

const logos = [
    {
        id: 0,
        src: "/assets/images/mongodb-icon.svg",
        title: "MongoDB",
        href: "https://www.mongodb.com/"
    },
    {
        id: 1,
        src: "/assets/images/expressjs-icon.svg",
        title: "Express",
        href: "https://expressjs.com/"
    },
    {
        id: 2,
        src: "/assets/images/reactjs-icon.svg",
        title: "React",
        href: "https://reactjs.org/"
    },
    {
        id: 3,
        src: "/assets/images/nodejs-icon.svg",
        title: "NodeJS",
        href: "https://nodejs.org/"
    },
    {
        id: 4,
        src: "/assets/images/mui-icon.svg",
        title: "Material UI",
        href: "https://mui.com/"
    },
    {
        id: 5,
        src: "/assets/images/p5js-asterisk.svg",
        title: "p5",
        href: "https://p5js.org/"
    },
    {
        id: 6,
        src: "/assets/images/swal2-icon.svg",
        title: "SweetAlert2",
        href: "https://sweetalert2.github.io/"
    },
    {
        id: 7,
        src: "/assets/images/heroku-icon.svg",
        title: "Heroku",
        href: "https://www.heroku.com/"
    },
    {
        id: 8,
        src: "/assets/images/github-icon.svg",
        title: "GitHub",
        href: "https://github.com/apc518/chambercode-front/"
    }
]

const iconSize = 125;

export default function AboutMe(){
    return (
        <Container style={{paddingTop: 20}}>
            <Hidden mdUp implementation="css">
                <br/><br/>
            </Hidden>

            <Typography variant="h3">
                Welcome!
            </Typography>
            <Typography variant="subtitle1" gutterBottom>Click any logo to visit that technology's website</Typography><br/>

            <Typography variant="h5">ChamberCode is built with the MERN stack: MongoDB, Express, React, and Node</Typography><br/>

            <LogoGrid logos={logos.slice(0,4)} itemSize={iconSize}/><br/>

            <Typography style={{paddingBottom: 20}} variant="h5">
                Some really <i>sweet</i> libraries in use: Material-UI, p5.js, and SweetAlert2
            </Typography>

            <LogoGrid logos={logos.slice(4,7)} itemSize={iconSize}/><br/>

            <Typography style={{paddingBottom: 20}} variant="h5">
                The project is hosted (front and back) on Heroku, and uses git/GitHub for version control. (click the github icon to see the repo for this site)
            </Typography>

            <LogoGrid logos={logos.slice(7,9)} itemSize={iconSize}/>
        </Container>
    )
}