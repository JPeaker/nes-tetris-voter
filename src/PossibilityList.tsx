import React, { useEffect, useRef } from 'react';
import './PossibilityList.css';
import { Possibility } from './CommonModels';
import possibilityDescriber from './possibility-describer';
import { Row, Button, ListGroup, Col } from 'react-bootstrap';

interface PossibilityListProps {
  possibilities: Possibility[];
  selected: Possibility | null;
  setPossibility: (possibility: Possibility) => void;
  showVote: () => void;
}

function PossibilityList({ possibilities, selected, setPossibility, showVote }: PossibilityListProps) {
  const selectedRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current!.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  });

  return <ListGroup className="overflow-auto possibility-list">
    { possibilities.map(possibility => {
      const isSelected = !!selected && selected.id === possibility.id;
      return (
        <ListGroup.Item key={possibility.id} active={isSelected} onClick={() => setPossibility(possibility)}>
          <Row ref={isSelected ? selectedRef : undefined} className="row-fluid">
            <Col><span className="possibility-item">{ possibilityDescriber(possibility) }</span></Col>
            <Col xs={2}>{
              isSelected
                ? <Button variant="light" className="float-right" onClick={showVote}>Vote</Button>
                : undefined
            }</Col>
          </Row>
        </ListGroup.Item>
      );
    })}
  </ListGroup>;
}

export default PossibilityList;
