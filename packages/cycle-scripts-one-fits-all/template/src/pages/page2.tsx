import xs, { Stream } from 'xstream';
import { VNode, DOMSource } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';

import { DriverSources, DriverSinks } from '../drivers';

export interface State {
    count : number;
}
export type Reducer = (prev : State) => State | undefined;
export type Sources = DriverSources & { onion : StateSource<State> };
export type Sinks = DriverSinks & { onion : Stream<Reducer> };

export function Page2(sources : Sources): Sinks {
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

function intent(DOM: DOMSource) : Stream<Reducer> {
    //const init$: Stream<Reducer> = xs.of<Reducer>(p => ({ count: 10 }))
    const init$ = xs.of(
        (prevState : State): State =>
            typeof prevState === 'undefined' ? { count: 30 } : prevState
    );

    const add$ : Stream<Reducer> = DOM.select('.add')
        .events('click')
        .mapTo<Reducer>(state => ({ ...state, count: state.count + 1 }));

    const subtract$ : Stream<Reducer> = DOM.select('.subtract')
        .events('click')
        .mapTo<Reducer>(state => ({ ...state, count: state.count - 1 }));

    return xs.merge(init$, add$, subtract$);
}

function view(state$ : Stream<State>) : Stream<VNode> {
    return state$.map(s => s.count).map(count =>
        <div>
            <h2>My Awesome Cycle.js app - Page 2</h2>
            <span>
                {'Counter: ' + count}
            </span>
            <button type="button" className="add">
                Increase
            </button>
            <button type="button" className="subtract">
                Decrease
            </button>
            <button type="button" data-action="speak">
                Wobble
            </button>
            <button type="button" data-action="navigate">
                Page 1
            </button>
        </div>
    );
}
