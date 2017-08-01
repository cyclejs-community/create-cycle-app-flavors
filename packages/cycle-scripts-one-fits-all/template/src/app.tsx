import xs, { Stream } from 'xstream';
import { VNode, DOMSource } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';
import isolate from '@cycle/isolate';
import { extractSinks } from 'cyclejs-utils'

import { DriverSources, DriverSinks, Component, driverNames } from './drivers';
import { RouteValue, routes, initialRoute } from './routes';

import { State as CounterState } from './components/counter'
import { State as SpeakerState } from './components/speaker'
export interface State {
    thing : number;
    counter : CounterState;
    speaker : SpeakerState;
}
const defaultState : State = {
    thing: 123,
    counter: { count: 5 },
    speaker: {}
};

export type Reducer = (prev? : State) => State | undefined;
export type Sources = DriverSources & { onion : StateSource<State> };
export type Sinks = DriverSinks & { onion : Stream<Reducer> };

export function App(sources : Sources) : Sinks {
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
