import React from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function SumbitForm(props) {

  
  return (
    <Form noValidate validated={props.validated} onSubmit={props.handleSubmit}>
            
    <Form.Group controlId="formBasicEmail">
      <p class='body-text'>
  Enter your target price with your email below and we will alert you when the Ethereum gas price is at or below your target.
</p>
    <Form.Label>Targeted price</Form.Label>
      <Form.Control
        required
        type='number'
        placeholder='Enter your target price here'
        onChange={props.handlePriceChange} />
  </Form.Group>

  <Form.Group controlId="formBasicPassword">
    <Form.Label>Email</Form.Label>
      <Form.Control
        required
        type="email"
        placeholder="Enter email"
        onChange={props.handleEmailChange}
      />
      <Form.Text className="text-muted">
      We'll never share your email with anyone else.
    </Form.Text>
  </Form.Group>
  {
   
      // <Button class='submit-button' variant="outlined" type='submit' value='submit'>Submit</Button>
      <Button class='submit-button' type='submit' variant="primary" value='submit' >
submit
</Button>
  }
</Form>
  )
}
