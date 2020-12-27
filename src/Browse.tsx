import React, { useState } from 'react';
import { Card, CardDeck, Col, Container, Row } from 'react-bootstrap';
import { Board } from './CommonModels';
import { ChevronLeftIcon, ChevronRightIcon } from '@primer/octicons-react';
import './Browse.css';
import { useHistory } from 'react-router-dom';

type BrowseBoard = Omit<Board, 'possibilities'>;

interface BrowseProps {
  voted: BrowseBoard[],
  recent: BrowseBoard[],
  votedError: string | null,
  recentError: string | null,
  votedLoading: boolean,
  recentLoading: boolean,
};

const getCard = (board: BrowseBoard, goTo: (route: string) => void, visible: boolean) => <Card key={board.id} onClick={() => goTo(board.id)} style={visible ? {} : { display: 'none' }}>
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

function Browse({ voted, recent, votedError, recentError, votedLoading, recentLoading }: BrowseProps) {
  const history = useHistory();
  const showCount = 5;
  const [voteIndex, setVoteIndex] = useState<number>(0);
  const [recentIndex, setRecentIndex] = useState<number>(0);

  const goToVote = (id: string) => history.push(`/vote?id=${id}`);
  const getCarousel = (index: number, setIndex: (index: number) => void, items: BrowseBoard[], loading: boolean, error: string | null) => {
    const content = loading
      ? <Col className="text-center"><h3>Loading...</h3></Col>
      : error
        ? <Col className="text-center"><h3>{error}</h3></Col>
        : <Col>
            <CardDeck>{items.map((board, bIndex) => getCard(board, goToVote, bIndex >= index && bIndex < index + showCount))}</CardDeck>
          </Col>;
    const leftDisabled = loading || error || index === 0;
    const rightDisabled = loading || error || index === voted.length - showCount;
    return <Row className="flex-row fluid align-items-center justify-content-center">
      <Col className="text-center align-content-center" xs={1} onClick={() => setIndex(Math.max(0, index - 1))}><ChevronLeftIcon className={`arrow ${leftDisabled ? 'disabled' : ''}`} size={48} /></Col>
      {content}
      <Col className="text-center align-content-center" xs={1} onClick={() => setIndex(Math.min(index + 1, voted.length - showCount))}><ChevronRightIcon className={`arrow ${rightDisabled ? 'disabled' : ''}`} size={48} /></Col>
    </Row>;
  };

  return <Container fluid>
    <Row className="mt-4 fluid">
      <h3 className="ml-4">Top Voted Boards</h3>
    </Row>
    {getCarousel(voteIndex, setVoteIndex, voted, votedLoading, votedError)}
    <Row className="mt-4 fluid">
      <h3 className="ml-4">Most Recent Boards</h3>
    </Row>
    {getCarousel(recentIndex, setRecentIndex, recent, recentLoading, recentError)}
  </Container>;
}

export default Browse;
