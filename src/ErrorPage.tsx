import React, { useEffect, useRef } from 'react';
import inputHandler from './input-handler';
import { Col, Container, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { SyncIcon } from '@primer/octicons-react';

function ErrorPage({ message }: { message: string }) {
  const history = useHistory();
  const enter = async () => {
    history.go(0);
  };

  const handler = (event: React.KeyboardEvent<HTMLDivElement>) => inputHandler({ enter }, event);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [true]);

  return (
    <Container tabIndex={-1} style={{ outline: 'none' }} ref={ref} onKeyDown={handler} fluid>
      <Row className="flex-row fluid align-items-center justify-content-center mt-4">
        <Col xs={12} className="error-page-col">
          <h3>Error: { message }</h3>
          <div className="error-page-block" onClick={enter}>
            <SyncIcon size={64} />
            <h5>Refresh</h5>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ErrorPage;
