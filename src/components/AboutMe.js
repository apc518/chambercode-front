import React, { useEffect, useState } from 'react';

import {Container, Typography, Hidden} from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';

import TechProjects from './TechProjects';

const youtubeLink = "https://www.youtube.com/andychamberlainmusic";
const realisrVideo = "https://www.youtube.com/watch?v=2b8rnIcBCTc";
const githubLink = "https://github.com/apc518";

const projects = [
    {
        id: 0,
        tech: "Python",
        techThumbnailSrc: "/assets/images/python-icon.svg",
        title: "Mass Aliaser",
        description: "A python script with a tkinter GUI that allows you to very efficiently speed up a folder of wav files without any anti-aliasing.",
        href: "https://github.com/apc518/mass-aliasing/"
    },
    {
        id: 1,
        tech: "C#",
        techThumbnailSrc: "/assets/images/c-sharp-icon.svg",
        title: "Chess Engine",
        description: "A C# chess engine. I used a library for move generation and the rules of the game, but I coded the negamax algorithm, alpha-beta pruning, and multi-threading.",
        href: null // coming soon
    },
    {
        id: 2,
        tech: "JavaScript",
        techThumbnailSrc: "/assets/images/javascript-icon.svg",
        title: "ChamberCode",
        description: "This site! And many embedded apps such as Flippr, Spookr, and Context Collapse.",
        href: "https://github.com/apc518/chambercode-front/"
    }
]

export default function AboutMe(){
    const [subs, setSubs] = useState("0");

    useEffect(() => {
        fetch("https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UCgd3Z7ShK-HME-gCxC-OaTQ&key=AIzaSyASo5KIEQZh4XWX3oV4SVqSLKCdAhUmc2s")
            .then((res) => {
                res.json().then(data => {
                    setSubs(data.items[0].statistics.subscriberCount)
                })
            })
            .catch(e => console.error(e));
    }, [])


    return (
        <Container style={{paddingTop: 20, display: "flex", flexDirection: "column", minHeight: "100vh"}}>
            <Hidden mdUp implementation="css">
                <br/><br/>
            </Hidden>

            <Typography variant="h4" gutterBottom>
                Hi, I'm Andy! 🎹 🖥️
            </Typography>

            <Typography variant="h5" style={{lineHeight: 1.2}} gutterBottom>
                I'm a programmer and musician. I have a <a href={youtubeLink} target="_blank" rel="noreferrer">YouTube channel</a> with about {subs} subscribers that features a lot of music theory and more <a href={realisrVideo} target="_blank" rel="noreferrer">programming</a> than you might expect!<br/>
            </Typography>

            <Typography variant="h5" gutterBottom>Other hobbies of mine include basketball and philosophy 🏀 🤔</Typography>

            <Typography variant="h5" style={{lineHeight: 1.2}} gutterBottom>
                My first ever program was to aid in experimenting with <a href="https://youtu.be/zZZySzJzMLQ" target="_blank" rel="noreferrer">negative harmony.</a> I've since fallen in love with coding and computer science, and am currently in my senior year at the University of Puget Sound where I major in computer science.<br/>
            </Typography>

            <Typography variant="h5" gutterBottom>
                Below are several programming languages in which I am proficient. Click any of them to go to a project of mine that uses the language!
            </Typography>

            <br/>
            <TechProjects projects={projects}/>

            <footer style={{marginTop: "auto", padding:"2em"}}>
            <Typography align="center" variant="h5" style={{lineHeight: 1.2}}>
                <a href={githubLink} target="_blank" rel="noreferrer">My Github</a> <GitHubIcon />
            </Typography>
            </footer>
        </Container>
    )
}