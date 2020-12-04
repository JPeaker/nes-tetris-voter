import React from 'react';
import { Button, Modal } from 'react-bootstrap';

function ConfirmVote({ show, description, vote, cancel }: { show: boolean, description?: string, vote: () => void, cancel: () => void }) {
  return (
    <Modal centered show={show} onHide={cancel} backdrop="static">
      <Modal.Body>Vote for {description}?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={cancel}>Cancel</Button>
        <Button variant="primary" onClick={vote}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmVote;
