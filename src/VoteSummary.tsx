import React from 'react';
import './PossibilityList.css';
import _ from 'lodash';
import { Possibility } from './CommonModels';
import { Grid } from 'nes-tetris-representation';
import TopVotedCard from './TopVotedCard';
import { Container } from 'react-bootstrap';
import { KebabHorizontalIcon } from '@primer/octicons-react';

interface VoteSummaryProps {
  grid: Grid;
  possibilities: Possibility[];
  votedFor: Possibility;
  changeVote: () => void;
  previewedPossibility: Possibility | null;
  previewPossibility: (possibility: Possibility) => void;
}

function VoteSummary({ grid, possibilities, votedFor, previewedPossibility, changeVote, previewPossibility }: VoteSummaryProps) {
  const sortedPossibilities = [...possibilities].sort((p1, p2) => p2.votes - p1.votes).map((possibility, index) => ({ possibility, rank: index + 1 }));
  const cardsToShow = sortedPossibilities.slice(0, 3);
  const votedInTopThree = cardsToShow.map(p => p.possibility.id).includes(votedFor.id);

  if (!votedInTopThree) {
    cardsToShow.push(sortedPossibilities.find(({ possibility }) => possibility.id === votedFor.id)!);
  }

  const totalVotes = possibilities.reduce((acc, p2) => acc + p2.votes, 0);
  return <Container style={{ padding: 0 }}>
    {cardsToShow.map((value, index) => {
      let addition = index === 3
        ? <KebabHorizontalIcon className="more-results-icon" size={24} />
        : undefined;

      return <>
        { addition }
        <TopVotedCard
          key={value.possibility.id}
          grid={grid}
          possibility={value.possibility}
          rank={value.rank}
          isVoted={value.possibility.id === votedFor.id}
          totalVotes={totalVotes}
          previewedPossibility={previewedPossibility}
          previewPossibility={previewPossibility}
          changeVote={changeVote}
          dense={!votedInTopThree && value.possibility.id === votedFor.id}
        />
      </>
    }
    )}
  </Container>;
}

export default VoteSummary;
