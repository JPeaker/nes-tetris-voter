import React from 'react';
import './PossibilityList.css';
import _ from 'lodash';
import { Possibility } from './CommonModels';
import possibilityDescriber from './possibility-describer';
import { TetrisGrid } from 'nes-tetris-components';
import { getPieceGrid, Grid } from 'nes-tetris-representation';
import { Card, Col, ProgressBar, Row } from 'react-bootstrap';

interface TopVotedCardProps {
  grid: Grid;
  possibility: Possibility;
  rank: number;
  totalVotes: number;
  isVoted: boolean;
  previewedPossibility: Possibility | null;
  previewPossibility: (possibility: Possibility) => void;
  changeVote: () => void;
  dense?: boolean;
}

const getMiniGrid = (grid: Grid, possibility: Possibility) => {
  const afterGrid = _.cloneDeep(grid);
  const pieceGrid = getPieceGrid(possibility.type);
  possibility.blocks.forEach(block => {
    afterGrid[block.row][block.column] = pieceGrid[0][0];
  });
  return <TetrisGrid beforeGrid={grid} grid={afterGrid} blockSizeInRem={0.35} />;
};

function TopVotedCard({
  grid,
  possibility,
  rank,
  totalVotes,
  previewPossibility,
  previewedPossibility,
  changeVote,
  isVoted = false,
  dense = false
}: TopVotedCardProps) {
  const percentage = Math.round(possibility.votes * 100 / totalVotes);
  const classes = [
    isVoted ? 'top-voted-card-is-voted' : undefined,
    previewedPossibility && previewedPossibility.id === possibility.id ? 'top-voted-card-is-previewed' : undefined,
    'mb-1'
  ];
  return <Card
    bg="light"
    className={classes.filter(c => !!c).join(' ')}
    onMouseEnter={() => previewPossibility(possibility)}
    onClick={!isVoted ? changeVote : undefined}
  >
    <Card.Body>
      <Row>
        <Col xs={1} className="pr-0">
          <h5>#{rank}</h5>
        </Col>
        { dense ? undefined : <Col xs={2}>
          { getMiniGrid(grid, possibility) }
        </Col> }
        <Col>
          <Row>
            <Col xs={12}><h5>{ possibilityDescriber(possibility) }</h5></Col>
          </Row>
          <Row>
            <Col xs={6}>{ possibility.votes } votes</Col>
          </Row>
          <Row>
            <Col xs={12}><ProgressBar now={percentage} label={`${percentage}%`} /></Col>
          </Row>
        </Col>
      </Row>
    </Card.Body>
  </Card>
}

export default TopVotedCard;
