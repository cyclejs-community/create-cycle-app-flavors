import xs, { Stream } from 'xstream';
import { VNode, DOMSource } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';

import { DriverSources, DriverSinks } from '../drivers';

export interface State {};
const defaultState : State = {};

export type Reducer = (prev : State) => State | undefined;
export type Sources = DriverSources & { onion : StateSource<State> };
export type Sinks = DriverSinks & { onion : Stream<Reducer> };

export function Speaker(sources : Sources) : Sinks {
    const action$ : Stream<Reducer> = intent(sources.DOM);
    const vdom$ : Stream<VNode> = view(sources.onion.state$);

    const touchSpeech$ = sources.DOM
        .select('[data-action="speak"]')
        .events('click')
        .map(({ currentTarget }) => (currentTarget as Element).textContent)
        .map(text => (typeof text === 'string' ? text : ''));

    const routes$ = sources.DOM
        .select('[data-action="navigate"]')
        .events('click')
        .mapTo('/');

    return {
        DOM: vdom$,
        speech: touchSpeech$,
        onion: action$,
        router: routes$
    };
}

function intent(DOM : DOMSource) : Stream<Reducer> {
    //const init$: Stream<Reducer> = xs.of<Reducer>(p => ({ count: 10 }))
    const init$ = xs.of<Reducer>(
        prevState => (prevState === undefined ? defaultState : prevState)
    );

    return xs.merge(init$);
}

function view(state$: Stream<State>) : Stream<VNode> {
    return state$.mapTo(
        <div>
            <h2>My Awesome Cycle.js app - Page 2</h2>
            <button type="button" data-action="speak">
                Speak to Me!
            </button>
            <button type="button" data-action="navigate">
                Page 1
            </button>
        </div>
    );
}
