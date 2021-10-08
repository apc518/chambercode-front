import React from 'react';

import {Container, Typography} from '@material-ui/core';

const youtubeLink = "https://www.youtube.com/andychamberlainmusic";
const githubLink = "https://github.com/apc518";

export default function About(props){
    return (
        <Container style={{paddingTop: 20}}>
            <Typography variant="h3" gutterBottom>
                Welcome!
            </Typography>

            <Typography variant="h5">
                ChamberCode uses the MERN stack. MongoDB, Express, React, and Node.js.
            </Typography>
            <Typography variant="h5">
                There are quite a few embedded static pages, many of which use <a href="https://p5js.org/" target="_blank" rel="noreferrer">p5.js</a>.
            </Typography>
            <Typography style={{paddingBottom: 20}} variant="h5">
                I also employ <a href="https://sweetalert2.github.io/" target="_blank" rel="noreferrer">SweetAlert2</a> all over the site.
            </Typography>

            <Typography variant="h5">
                <a href={githubLink} target="_blank" rel="noreferrer">Github</a>
            </Typography>
            <Typography variant="h5">
                <a href={youtubeLink} target="_blank" rel="noreferrer">YouTube</a>
            </Typography>
        </Container>
    )
}