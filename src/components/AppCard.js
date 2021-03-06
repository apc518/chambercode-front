import React from 'react';
import { useHistory } from 'react-router-dom';

import { makeStyles, createStyles, CardContent, Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';

const useStyles = makeStyles(() =>
  createStyles({
    card: {
      border: '2px solid #00cfcf',
      transition: '0.2s',
      '&:hover': {
        transform: 'scale(1.04) rotate(1.0deg)',
        border: '4px solid #fff'
      },
      maxWidth: '32rem'
    },
    media: {
      height: '65vh'
    },
    cardText: {
      backgroundColor: "#444",
      color: "#ddd",
      fontSize: 20,
      fontFamily: "Trebuchet MS"
    }
  })
);

export default function AppCard({app}){
  const classes = useStyles();

  const history = useHistory();

  return(
    <div>
      <Card elevation={3} className={classes.card}>
        <CardActionArea>
            <CardMedia
              className={classes.media}
              image={app.thumbnail}
              title={app.title}
              onClick={() => {
                history.push(app.path)
              }}
            />
            <CardContent
              className={classes.cardText}
            >
              <Typography gutterBottom variant="h4" component="h2">
                {app.title}
              </Typography>
              {app.description}
            </CardContent>
        </CardActionArea>
      </Card>
    </div>
  )
}