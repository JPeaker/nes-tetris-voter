import React from 'react';
import { Col, Container, Row, Spinner } from 'react-bootstrap';

function Loading({ message }: { message?: string }) {
  return (
    <Container fluid>
      <Row className="flex-row fluid align-items-center justify-content-center mt-4">
        <Col xs={12} className="loading-page-col">
          <h3>{ message || 'Loading' }</h3>
          <div style={{ textAlign: 'center' }}>
            <Spinner variant="primary" animation="border" />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Loading;
