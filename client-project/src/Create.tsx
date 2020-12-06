import React, { useRef, useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import inputHandler from './input-handler';

function Create() {
  const handler = (event: React.KeyboardEvent<HTMLDivElement>) => inputHandler({
  }, event);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return (
    <Container tabIndex={-1} style={{ outline: 'none' }} ref={ref} onKeyDown={handler} fluid>
      <Row className="flex-row fluid align-items-center justify-content-center mt-5">
        Create
      </Row>
    </Container>
  );
}

export default Create;
