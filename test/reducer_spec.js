/*eslint-env node, mocha */
import {Map, fromJS} from 'immutable';
import {expect} from 'chai';

import reducer from '../src/reducer';

/*
Actions - are objects that represent actions to be performed on the data model.
Reducer - reduces actions to the transform functions of the model - thereby
creating an abstraction layer between view and model.
Can be invoked with a reduce to perform batched actions.

By convention action types are uppercase strings.

See http://redux.js.org/docs/basics/Reducers.html
 */

describe('reducer', () => {

  it('handles SET_ENTRIES', () => {
    const initialState = Map();
    const action = {type: 'SET_ENTRIES', entries: ['Trainspotting']};
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      entries: ['Trainspotting']
    }));
  });

  it('handles NEXT', () => {
    const initialState = fromJS({
      entries: ['Trainspotting', '28 Days Later']
    });
    const action = {type: 'NEXT'};
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      vote: {
        round: 1,
        pair: ['Trainspotting', '28 Days Later']
      },
      entries: []
    }));
  });

  it('handles VOTE', () => {
    const initialState = fromJS({
      vote: {
        round: 1,
        pair: ['Trainspotting', '28 Days Later']
      },
      entries: []
    });
    const action = {type: 'VOTE', entry: 'Trainspotting', clientId: 'voter1'};
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      vote: {
        round: 1,
        pair: ['Trainspotting', '28 Days Later'],
        tally: {Trainspotting: 1},
        votes: {
          voter1: 'Trainspotting'
        }
      },
      entries: []
    }));
  });

  it('has an initial state', () => {
    const action = {type: 'SET_ENTRIES', entries: ['Trainspotting']};
    const nextState = reducer(undefined, action);
    expect(nextState).to.equal(fromJS({
      entries: ['Trainspotting']
    }));
  });

  it('can be used with reduce', () => {
    const actions = [
      {type: 'SET_ENTRIES', entries: ['Trainspotting', '28 Days Later']},
      {type: 'NEXT'},
      {type: 'VOTE', entry: 'Trainspotting', clientId: 'voter1'},
      {type: 'VOTE', entry: '28 Days Later', clientId: 'voter2'},
      {type: 'VOTE', entry: 'Trainspotting', clientId: 'voter3'},
      {type: 'NEXT'}
    ];
    const finalState = actions.reduce(reducer, Map());

    expect(finalState).to.equal(fromJS({
      winner: 'Trainspotting'
    }));
  });

});
