import React, { useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';

function ConfirmVote({ show, description, vote, cancel, loading }: { show: boolean, description?: string, vote: () => Promise<void>, cancel: () => void, loading: boolean }) {
  return (
    <Modal centered show={show} onHide={cancel}>
      <Modal.Body>Vote for {description}?</Modal.Body>
      <Modal.Footer>
        <Button disabled={loading} variant="secondary" onClick={cancel}>Cancel</Button>
        <Button disabled={loading} variant="primary" onClick={vote}>{ loading ? <Spinner size="sm" animation="border" /> : 'Confirm' }</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmVote;
