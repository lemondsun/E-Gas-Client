import React from 'react';
import Modal from 'react-bootstrap/Modal';

export default function SuccessModal(props) {


  return (
    <Modal
        show={props.show}
        onHide={props.handleClose}
        backdrop="static"
          keyboard={false}
          centered
      >
        <Modal.Header >
          <Modal.Title> Thank you for using our service.</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        Refresh the page to enter another price.
        </Modal.Body>
      
      </Modal>
  )
}
