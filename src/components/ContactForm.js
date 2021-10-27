import React, {useState} from 'react';

import {validate} from 'email-validator';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import SendIcon from '@material-ui/icons/Send';
import { makeStyles, withStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const useStyles = makeStyles({
  field: {
    marginTop: 20,
    marginBottom: 20,
    display: 'block'
  },
  text: {
    color: 'white'
  },
  pageTitle: {
    marginTop: 20,
    color: 'white'
  }
});

const CssTextField = withStyles({
  root: {
    '& label': {
      color: 'gray',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#acacac',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
    },
  },
})(TextField);

export default function ContactForm() {
  const classes = useStyles();

  const [email, setEmail] = useState('');
  const [messageBody, setMessageBody] = useState('');

  const [titleError, setTitleError] = useState(false);
  const [detailsError, setDetailsError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(`email: ${email}, body: ${messageBody}`);
    
    setTitleError(!validate(email));
    setDetailsError(!messageBody);

    if(email && messageBody) {
      MySwal.fire({
        title: "Success!",
        text: "If your response wasn't spam, expect a response within 3 days.",
        icon: "success"
      });
    }
  }

  return (
    <Container>
      <Typography
        variant="h5"
        color="textPrimary"
        component="h2"
        gutterBottom
        align="left"
        className={classes.pageTitle}
      >
        Contact
      </Typography>

      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <CssTextField
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          label="Email"
          color="secondary"
          fullWidth
          required // does not change validation, only adds asterisk to field label
          InputProps={{
            className: classes.text
          }}
          className={classes.field}
          error={titleError}
        />
        <CssTextField
          onChange={(e) => setMessageBody(e.target.value)}
          variant="outlined"
          label="Message"
          color="secondary"
          fullWidth
          required // does not change validation, only adds asterisk to field label
          InputProps={{
            className: classes.text
          }}
          className={classes.field}
          multiline
          rows={4}
          error={detailsError}
        />
        
        <br/>

        <Button
          type="submit"
          variant="contained"
          color="secondary"
          disableElevation
          endIcon={<SendIcon/>}
        >
          Send
        </Button>
      </form>
    </Container>
  )
}
