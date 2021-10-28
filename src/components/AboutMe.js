import React, { useEffect, useState } from 'react';

import {Container, Typography, Hidden, CircularProgress} from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';

import TechProjects from './TechProjects';
import {projects} from "../objects/projects";
import ContactForm from './ContactForm';

const youtubeLink = "https://www.youtube.com/andychamberlainmusic";
const realisrVideo = "https://www.youtube.com/watch?v=2b8rnIcBCTc";
const githubLink = "https://github.com/apc518";
const urlBase = process.env.NODE_ENV === "production" ? "https://chambercode-back.herokuapp.com/" : "http://localhost:5000/";

export default function AboutMe(){
    const [subs, setSubs] = useState(<CircularProgress size="1.2rem"/>);
    
    useEffect(() => {
        fetch(`${urlBase}youtubestats/andy/subscribers`)
            .then((res) => {
                res.json().then(data => {
                    let subCount = data.items[0].statistics.subscriberCount;
                    let subCountRounded = 100 * Math.round(parseInt(subCount) / 100)
                    setSubs(subCountRounded);
                })
                .catch(e => console.error(e));
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

            <TechProjects projects={projects}/>
            
            <hr style={{
                border: "1px solid #888",
                minWidth: "100%",
                marginTop: 40
            }}/>

            <ContactForm />

            <footer style={{marginTop: "auto", padding:"2em"}}>
            <Typography align="center" variant="h5" style={{lineHeight: 1.2}}>
                <a href={githubLink} target="_blank" rel="noreferrer">My Github</a> <GitHubIcon />
            </Typography>
            </footer>
        </Container>
    )
}