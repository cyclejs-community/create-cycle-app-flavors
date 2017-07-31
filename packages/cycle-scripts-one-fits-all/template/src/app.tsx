import xs, { Stream } from 'xstream';
import { VNode, DOMSource } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';
import isolate from '@cycle/isolate';

import { DriverSources, DriverSinks, Component } from './drivers';
import { routes, initialRoute } from './routes';

import { State as p1State } from './pages/page1';
import { State as p2State } from './pages/page2';
export interface State {
    thing: number;
    'page_/' : p1State;
    'page_/p2' : p2State;
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
                      'page_/': { count: 0 },
                      'page_/p2': { count: 10 }
                  }
                : prevState
    );

    const match$ = sources.router.define(routes);

    const pageSinks$ = match$.map(
        ({ path, value: page } : { path : string; value : Component }) => {
            return isolate(page, `page_${path}`)(
                Object.assign({}, sources, {
                    router: sources.router.path(path)
                })
            );
        }
    ); // no need to remember?

    return {
        // TODO remove explicit declaration of sink keys if possible
        DOM: pageSinks$.map((ps : Sinks) => ps.DOM).flatten(),
        onion: xs.merge(initReducer$, pageSinks$.map((ps : Sinks) => ps.onion).flatten() as Stream<Reducer>),
        speech: pageSinks$.map((ps : Sinks) => ps.speech).flatten(),
        router: pageSinks$.map((ps : Sinks) => ps.router).flatten()
    };
}
