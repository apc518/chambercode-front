import React, {useState} from 'react';

import {validate} from 'email-validator';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import SendIcon from '@material-ui/icons/Send';
import { makeStyles, withStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const urlBase = process.env.NODE_ENV === "production" ? "https://chambercode-back.herokuapp.com" : "http://localhost:5000";

const useStyles = makeStyles({
  field: {
    marginTop: 20,
    marginBottom: 20,
    display: 'block'
  },
  text: {
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
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');

  const [emailError, setEmailError] = useState(false);
  const [subjectError, setSubjectError] = useState(false);
  const [messageError, setMessageError] = useState(false);

  const fields = [
    {
      id: 0,
      name: "Your Email",
      rows: 1,
      func: setEmail,
      error: emailError
    },
    {
      id: 1,
      name: "Subject",
      rows: 1,
      func: setSubject,
      error: subjectError
    },
    {
      id: 2,
      name: "Message",
      rows: 6,
      func: setMessageBody,
      error: messageError
    }
  ]

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(`email: ${email}, subject: ${subject}, body: ${messageBody}`);
    
    setEmailError(!validate(email));
    setSubjectError(!subject);
    setMessageError(!messageBody);

    if(validate(email) && subject && messageBody){
      fetch(`${urlBase}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          subject: subject,
          message: messageBody
        })
      })
      .then(res => {
        if(res.ok){
          MySwal.fire({
            title: "Success!",
            text: "If your response wasn't spam, expect a response within 3 days.",
            icon: "success"
          });
        }
        else{
          throw new Error();
        }
      })
      .catch(e => {
        MySwal.fire({
          title: "Error :(",
          text: "Likely you inputted an invalid email address. Double-check that your email is spelled correctly.",
          icon: "error"
        })
      });
    }

    if(validate(email) && subject && messageBody) {
      MySwal.fire({
        title: "Success!",
        text: "If your response wasn't spam, expect a response within 3 days.",
        icon: "success"
      });
    }
  }

  return (
    <Container maxWidth="md">
      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        {fields.map(field=>(
          <CssTextField
            onChange={e => field.func(e.target.value)}
            variant="outlined"
            label={field.name}
            color="secondary"
            fullWidth
            required // does not affect validation, only adds asterisk to field label
            InputProps={{ className: classes.text }}
            className={classes.field}
            error={field.error}
            multiline={field.rows > 1 ? true : false}
            rows={field.rows}
            key={field.id}
          />
        ))}
        
        <div style={{
          textAlign: "right",
        }}>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disableElevation
            endIcon={<SendIcon/>}
          >
            Send
          </Button>
        </div>
      </form>
    </Container>
  )
}
