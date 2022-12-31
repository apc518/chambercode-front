import React from 'react';

import { makeStyles, Card, CardActionArea, CardContent, CardHeader, CardMedia, Grid } from '@material-ui/core';

import Swal from 'sweetalert2';

const useStyles = makeStyles({
    logo: {
        transition: '0.15s',
        '&:hover': {
            transform: 'scale(1.05)'
        }
    }
});

export default function TechProjects({projects}){
    const classes = useStyles();

    return (
        <Grid container>
            {projects.map((project, idx) => (
                <Grid 
                    item 
                    key={idx}
                    xs={12}
                    sm={6}
                    style={{
                        display: "flex",
                        justifyContent: "center"
                    }}
                >
                    <Card 
                        elevation={0}
                        style={{
                            background: idx % 2 === 0 ? "#004035" : "#00353e",
                            color: "white",
                            width: 300,
                            marginTop: 20,
                        }}
                    >
                        <CardHeader title={project.title}>
                            {project.tech}
                        </CardHeader>
                        <CardActionArea
                            onClick={() => {
                                if("href" in project && project.href){
                                    window.open(project.href);
                                }
                                else{
                                    Swal.fire({
                                        title: "This link isn't available right now 😕 Try again later.",
                                        toast: true,
                                    })
                                }
                            }}
                            className={classes.logo}
                        >
                            <CardMedia 
                                style={{width: 150, height: 150, marginLeft: "25%"}}
                                image={project.techThumbnailSrc}
                            />
                        </CardActionArea>
                        <CardContent>
                            {project.description}
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    )
}