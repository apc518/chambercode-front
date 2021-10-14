import React from 'react';
import { useHistory } from 'react-router-dom';

import { makeStyles, createStyles, CardContent } from '@material-ui/core';
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
      }
    },
    media: {
      height: '75vh'
    },
    cardText: {
      backgroundColor: "#444",
      color: "#ddd",
      fontSize: 24,
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
              onClick={(e) => {
                history.push(app.path)
              }}
            />
            <CardContent
              className={classes.cardText}
            >
              {app.description}
            </CardContent>
        </CardActionArea>
      </Card>
    </div>
  )
}