import React from 'react';

import {Container, Typography, Hidden} from '@material-ui/core';

const youtubeLink = "https://www.youtube.com/andychamberlainmusic";
const realisrVideo = "https://www.youtube.com/watch?v=2b8rnIcBCTc";
const githubLink = "https://github.com/apc518";

export default function AboutMe(){
    return (
        <Container style={{paddingTop: 20}}>
            <Hidden smUp implementation="css">
                <br/><br/>
            </Hidden>

            <Typography variant="h4" gutterBottom>
                Hi, I'm Andy!
            </Typography>

            <Typography variant="h6" style={{lineHeight: 1.2}} gutterBottom>
                I enjoy music and programming. I've run a <a href={youtubeLink} target="_blank" rel="noreferrer">YouTube channel</a> since 2016 that features a lot of music theory and more <a href={realisrVideo} target="_blank" rel="noreferrer">programming</a> than you might expect!<br/>
            </Typography>

            <Typography variant="h6" style={{lineHeight: 1.2}} gutterBottom>
                In fact, I first got into programming to solve a music theory problem! I've since fallen in love with coding and computer science, and am currently in my senior year at the University of Puget Sound where I major in computer science.<br/>
            </Typography>

            <Typography variant="h6" style={{lineHeight: 1.2}}>
                <a href={githubLink} target="_blank" rel="noreferrer">Github</a>
            </Typography>
        </Container>
    )
}