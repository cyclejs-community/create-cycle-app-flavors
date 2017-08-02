import xs, { Stream } from 'xstream';
import { VNode, DOMSource } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';

import { BaseSources, BaseSinks } from '../drivers';
import { SpeechSource, SpeechSink } from '../drivers/speech';

// Types
export interface Sources extends BaseSources {
    DOM : DOMSource;
}
interface AllSources extends Sources {
    onion : StateSource<State>;
}
export interface Sinks extends BaseSinks {
    DOM : Stream<VNode>;
    router : RouterSink;
}
interface AllSinks extends Sinks {
    onion : Stream<Reducer>;
}

// State
export interface State {
    count : number;
};
const defaultState : State = {
    count: 30
};
export type Reducer = (prev : State) => State | undefined;

export function Counter(sources : AllSources) : AllSinks {
    const action$ : Stream<Reducer> = intent(sources.DOM);
    const vdom$ : Stream<VNode> = view(sources.onion.state$);

    const routes$ = sources.DOM
        .select('[data-action="navigate"]')
        .events('click')
        .mapTo('/p2');

    return {
        DOM: vdom$,
        onion: action$,
        router: routes$
    };
}

function intent(DOM : DOMSource) : Stream<Reducer> {
    const init$ = xs.of<Reducer>(
        prevState => (prevState === undefined ? defaultState : prevState)
    );

    const add$ : Stream<Reducer> = DOM.select('.add')
        .events('click')
        .mapTo<Reducer>(state => ({ ...state, count: state.count + 1 }));

    const subtract$ : Stream<Reducer> = DOM.select('.subtract')
        .events('click')
        .mapTo<Reducer>(state => ({ ...state, count: state.count - 1 }));

    return xs.merge(init$, add$, subtract$);
}

function view(state$ : Stream<State> : Stream<VNode> {
    return state$.map(({count}) =>
        <div>
            <h2>My Awesome Cycle.js app - Page 1</h2>
            <span>
                {'Counter: ' + count}
            </span>
            <button type="button" className="add">
                Increase
            </button>
            <button type="button" className="subtract">
                Decrease
            </button>
            <button type="button" data-action="navigate">
                Page 2
            </button>
        </div>
    );
};
