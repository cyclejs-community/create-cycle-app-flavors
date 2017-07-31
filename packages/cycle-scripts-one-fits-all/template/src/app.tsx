import xs, { Stream } from 'xstream';
import { VNode, DOMSource } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';
import isolate from '@cycle/isolate';

import { DriverSources, DriverSinks, Component } from './drivers';
import { RouteValue, routes, initialRoute } from './routes';

import { State as p1State } from './pages/page1';
import { State as p2State } from './pages/page2';
export interface State {
    thing: number;
    'page1' : p1State;
    'page2' : p2State;
}
export type Reducer = (prev? : State) => State | undefined;
export type Sources = DriverSources & { onion : StateSource<State> };
export type Sinks = DriverSinks & { onion : Stream<Reducer> };

export function App(sources : Sources) : Sinks {
    const state$ = sources.onion.state$;
    const initReducer$ = xs.of(
        (prevState : State): State =>
            typeof prevState === 'undefined'
                ? {
                      thing: 123,
                      'page1': { count: 0 },
                      'page2': { count: 10 }
                  }
                : prevState
    );

    const match$ = sources.router.define(routes);

    const pageSinks$ = match$.map(
        ({ path, value } : { path : string; value : RouteValue }) => {
            const { page, scope } = value;
            return isolate(page, scope)({
                ...sources,
                router: sources.router.path(path)
            });
        }
    ); // no need to remember?

    return {
        // TODO remove explicit declaration of sink keys if possible
        DOM: pageSinks$.map((ps : Sinks) => ps.DOM).flatten(),
        onion: xs.merge(initReducer$, pageSinks$.map((ps : Sinks) => ps.onion).flatten() as Stream<Reducer>),
        router: pageSinks$.map((ps : Sinks) => ps.router).flatten(),
        speech: pageSinks$.map((ps : Sinks) => ps.speech).flatten()
    };
}
