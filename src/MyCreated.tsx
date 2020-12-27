import React, { useState } from 'react';
import { Card, CardDeck, Col, Container, Row } from 'react-bootstrap';
import { Board } from './CommonModels';
import { ChevronLeftIcon, ChevronRightIcon } from '@primer/octicons-react';
import './Browse.css';
import { Link, useHistory } from 'react-router-dom';

type BrowseBoard = Omit<Board, 'possibilities'>;

interface BrowseProps {
  boards: BrowseBoard[],
  error: string | null,
  loading: boolean,
};

const getCard = (board: BrowseBoard, goTo: (route: string) => void, visible: boolean) =>
  <Card className="card-browse" key={board.id} onClick={() => goTo(board.id)} style={visible ? {} : { display: 'none' }}>
    <Card.Img variant="top" src={`./vote/${board.id}/thumbnail`} />
    <Card.Body>
      <Card.Title>Board #{board.id}</Card.Title>
      <Card.Text>
        {board.createdAt ? `Created: ${new Date(board.createdAt).toDateString()}` : undefined}
        <br />
        Votes: {board.votes}
      </Card.Text>
    </Card.Body>
  </Card>;

function MyCreated({ boards, error, loading }: BrowseProps) {
  const history = useHistory();
  const showCount = 8;
  const [index, setIndex] = useState<number>(0);

  const goToVote = (id: string) => history.push(`/vote?id=${id}`);
  const getCarousel = (index: number, setIndex: (index: number) => void, items: BrowseBoard[], loading: boolean, error: string | null) => {
    const content = loading
      ? <Col className="text-center"><h3>Loading...</h3></Col>
      : error
        ? <Col className="text-center"><h3>{error}</h3></Col>
        : items.length === 0
          ? <Col className="text-center"><h3>Looks like you haven't created any scenarios yet! Go and create one <Link to="/create">here</Link></h3></Col>
          : <Col>
              <CardDeck>{items.map((board, bIndex) => getCard(board, goToVote, bIndex >= index && bIndex < index + showCount))}</CardDeck>
            </Col>;
    const leftDisabled = loading || error || index <= 0;
    const rightDisabled = loading || error || index >= items.length - showCount;
    return (
      <Row className="flex-row fluid align-items-center justify-content-center">
        <Col className="text-center align-content-center" xs={1} onClick={() => setIndex(Math.max(0, index - 1))}>
          <ChevronLeftIcon className={`arrow ${leftDisabled ? 'disabled' : ''}`} size={48} />
        </Col>
        {content}
        <Col className="text-center align-content-center" xs={1} onClick={() => setIndex(Math.min(index + 1, items.length - showCount))}>
          <ChevronRightIcon className={`arrow ${rightDisabled ? 'disabled' : ''}`} size={48} />
        </Col>
      </Row>
    );
  };

  return <Container fluid>
    <Row className="mt-4 fluid">
      <h3 className="ml-4">My Scenarios</h3>
    </Row>
    {getCarousel(index, setIndex, boards, loading, error)}
  </Container>;
}

export default MyCreated;
