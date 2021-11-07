import React from 'react';

import {Container, Hidden, Typography} from '@material-ui/core';
import LogoGrid from './LogoGrid';

import GitHubIcon from '@material-ui/icons/GitHub';
import {logos} from '../objects/logos';

const iconSize = 125;

const githubLink = "https://github.com/apc518/chambercode-front"

export default function AboutMe(){
    return (
        <Container style={{paddingTop: 20}}>
            <Hidden mdUp implementation="css">
                <br/><br/>
            </Hidden>

            <Typography variant="h3">
                Welcome!
            </Typography><br/>
            <hr style={{
                border: "1px solid #888",
                minWidth: "100%",
            }}/>

            <Typography
                variant="h6"
                style={{
                    lineHeight: 1.25,
                    marginBottom: 30
                }}
            >
                ChamberCode is an app-hub for several web applications I've built. While each embedded site can be viewed at its own netlify address, this site serves as an easy way for people who use my apps to use them all in one place, and for me to showcase my skills. All with with a simple, memorable domain.
            </Typography><br/>

            <Typography variant="h3">
                Technologies
            </Typography>
            <hr style={{
                border: "1px solid #888",
                minWidth: "100%",
            }}/>
            <Typography variant="subtitle2" gutterBottom>Click any logo to visit that technology's website</Typography><br/>
            
            <Typography variant="h5">Main tech stack</Typography><br/>

            <LogoGrid logos={logos.slice(0,4)} itemSize={iconSize}/><br/>

            <Typography style={{paddingBottom: 20}} variant="h5">
                Some really <i>sweet</i> libraries
            </Typography>

            <LogoGrid logos={logos.slice(4,7)} itemSize={iconSize}/><br/>

            <Typography style={{paddingBottom: 20}} variant="h5">
                ChamberCode itself is hosted (front and back) on Heroku, and most of the static sites within are hosted on Netlify.
            </Typography>

            <LogoGrid logos={logos.slice(7,9)} itemSize={iconSize}/><br/>
            
            <Typography style={{paddingBottom: 20}} variant="h5">
                I use Git and GitHub for version control.
            </Typography>

            <LogoGrid logos={logos.slice(9,11)} itemSize={iconSize} />

            <footer style={{
                marginTop: 30,
                padding:"2em"
            }}>
                <Typography
                    align="center"
                    variant="h5"
                    style={{
                        lineHeight: 1.2
                    }}
                >
                    <a href={githubLink} target="_blank" rel="noreferrer">ChamberCode on Github</a> <GitHubIcon />
                </Typography>
            </footer>
        </Container>
    )
}