import { Container, Typography } from '@material-ui/core';
import React from 'react';

export default function NotFound(){
    return (
        <Container>
            <div style={{minHeight: 30}}></div>
            <Typography
                variant="h1"
                align="center"
            >
                404
            </Typography>

            <Typography
                variant="h4"
                align="center"
            >
                I couldn't find that page 🤔<br/>
            </Typography>
        </Container>
    )
}