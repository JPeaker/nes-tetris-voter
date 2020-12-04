import React, { useEffect } from 'react';
import './PossibilityList.css';
import { Possibility } from './CommonModels';
import possibilityDescriber from './possibility-describer';
import { Col, Container, ListGroup, Row } from 'react-bootstrap';
import inputHandler from './input-handler';

interface VotesListProps {
  possibilities: Possibility[];
  selected: Possibility;
  setSelected: (possibility: Possibility) => void;
}

function VotesList({ possibilities, selected, setSelected }: VotesListProps) {
  const sorted = [...possibilities].sort((p1, p2) => p2.votes - p1.votes);

  const selectedIndex = sorted.findIndex(p => p.id === selected.id);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => inputHandler({
      ArrowUp: () => setSelected(sorted[Math.max(0, selectedIndex - 1)]),
      ArrowDown: () => setSelected(sorted[Math.min(sorted.length - 1, selectedIndex + 1)]),
    }, event);

    document.addEventListener('keydown', handler);

    return () => {
      document.removeEventListener('keydown', handler);
    }
  });

  return (
    <ListGroup className="overflow-auto possibility-list col-6 container">
      { [...possibilities].sort((p1, p2) => p2.votes - p1.votes).map(possibility => {
        return (
          <ListGroup.Item
            key={possibility.id}
            active={selected.id === possibility.id}
            onClick={() => setSelected(possibility)}
          >
            <Container>
              <Row>
                <Col xs={8}>{ possibilityDescriber(possibility) }</Col>
                <Col className="justify-content-end" xs={4}>{ possibility.votes }</Col>
              </Row>
            </Container>
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
}

export default VotesList;
