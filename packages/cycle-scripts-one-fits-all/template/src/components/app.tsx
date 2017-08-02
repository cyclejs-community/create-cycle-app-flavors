import xs, { Stream } from 'xstream';
import { VNode, DOMSource } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';
import isolate from '@cycle/isolate';
import { extractSinks } from 'cyclejs-utils';

import { BaseSources, BaseSinks, driverNames } from '../drivers';
import { RouteValue, routes, initialRoute } from '../routes';

// Types
import {
    State as CounterState,
    Sources as CounterSources,
    Sinks as CounterSinks
} from './counter';
import {
    State as SpeakerState,
    Sources as SpeakerSources,
    Sinks as SpeakerSinks
} from './speaker';
export interface Sources extends BaseSources, SpeakerSources, CounterSources {
    onion: StateSource<State>;
}
export interface Sinks extends BaseSinks, SpeakerSinks, CounterSinks {
    onion: Stream<Reducer>;
}

// State
export interface State {
    thing: number;
    counter : CounterState;
    speaker : SpeakerState;
}
const defaultState : State = {
    thing: 123,
    counter: { count: 5 },
    speaker: { text: 'Edit me!' }
}
export type Reducer = (prev? : State) => State | undefined;

export function App(sources : AllSources) : AllSinks {
    const state$ = sources.onion.state$;
    const initReducer$ = xs.of<Reducer>(
        prevState => (prevState === undefined ? defaultState : prevState)
    );

    const match$ = sources.router.define(routes);

    const componentSinks$ = match$.map(
        ({ path, value } : { path : string; value : RouteValue }) => {
            const { component, scope } = value;
            return isolate(component, scope)({
                ...sources,
                router: sources.router.path(path)
            });
        }
    ); // no need to remember?

    const sinks = extractSinks(componentSinks$, driverNames);
    return {
        ...sinks,
        onion: xs.merge(initReducer$, sinks.onion)
    };
}
