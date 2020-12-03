import React from 'react';
import { gql, useMutation } from '@apollo/client';
import _ from 'lodash';
import LazyLoad from 'react-lazyload';
import { getPiece, Grid } from 'nes-tetris-representation';
import { TetrisGrid } from 'nes-tetris-components';
import './PossibilityList.css';
import { Possibility } from './CommonModels';
import possibilityDescriber from './possibility-describer';

const ADD_VOTE = gql`
  mutation addVote($id: String!) {
    addVote(id: $id) {
      votes
    }
  }
`;

const REMOVE_VOTE = gql`
  mutation removeVote($id: String!) {
    removeVote(id: $id) {
      votes
    }
  }
`;

interface VoteData {
  votes: number;
}

interface VoteButtonProps {
  selected: Possibility | null;
  voted: Possibility | null;
  onVoted: (possibility: Possibility | null) => void;
}

enum VoteState {
  NotVotedAndNoSelection,
  NotVotedAndSelection,
  VotedAndNoSelection,
  VotedAndSelectedSame,
  VotedAndSelectedDifferent
}

const getVoteState = (voted: Possibility | null, selected: Possibility | null): VoteState => {
  let state: VoteState;
  if (!voted) {
    if (selected) {
      state = VoteState.NotVotedAndSelection;
    } else {
      state = VoteState.NotVotedAndNoSelection;
    }
  } else {
    if (selected) {
      if (selected.id === voted.id) {
        state = VoteState.VotedAndSelectedSame;
      } else {
        state = VoteState.VotedAndSelectedDifferent;
      }
    } else {
      state = VoteState.VotedAndNoSelection;
    }
  }

  return state;
}

function VoteButton({ selected, voted, onVoted }: VoteButtonProps) {
  const [addVote] = useMutation<VoteData>(ADD_VOTE);
  const [removeVote] = useMutation<VoteData>(REMOVE_VOTE);
  const voteState = getVoteState(voted, selected);

  const buttonDisabled = voteState === VoteState.NotVotedAndNoSelection;
  const onClick = () => {
    if (buttonDisabled) {
      return;
    }

    switch (voteState) {
      case VoteState.NotVotedAndSelection:
        addVote({ variables: { id: selected!.id }});
        onVoted(selected!);
        break;
      case VoteState.VotedAndNoSelection:
        removeVote({ variables: { id: voted!.id }});
        onVoted(null);
        break;
      case VoteState.VotedAndSelectedDifferent:
        removeVote({ variables: { id: voted!.id }});
        addVote({ variables: { id: selected!.id }});
        onVoted(selected!);
        break;
      case VoteState.VotedAndSelectedSame:
        removeVote({ variables: { id: voted!.id }});
        onVoted(null);
        break;
      default:
        break;
    }
  }

  let message: string;
  switch (voteState) {
    case VoteState.VotedAndNoSelection:
    case VoteState.VotedAndSelectedSame:
      message = 'Remove Vote';
      break;
    case VoteState.VotedAndSelectedDifferent:
      message = 'Change Vote';
      break;
    default:
      message = 'Vote';
      break;
  }

  return (
    <button disabled={buttonDisabled} onClick={onClick}>{message}</button>
  );
}

export default VoteButton;
