import xs, { Stream } from 'xstream';
import { restartable } from 'cycle-restart';
import { makeDOMDriver, VNode, DOMSource } from '@cycle/dom';
import { makeHTTPDriver, HTTPSource, RequestOptions } from '@cycle/http';
import { timeDriver, TimeSource } from '@cycle/time';
import { makeRouterDriver, RouterSource, RouteMatcher } from 'cyclic-router';
import { createBrowserHistory } from 'history';
import switchPath from 'switch-path';
//import storageDriver from '@cycle/storage'
const storageDriver = require('@cycle/storage').default; // TODO PR to add missing typeings

import speechDriver from './drivers/speech';

let mkDriversCond: any;
/// #if PRODUCTION
mkDriversCond = () => ({
    DOM: makeDOMDriver('#app'),
    HTTP: makeHTTPDriver(),
    time: timeDriver,
    router: makeRouterDriver(
        createBrowserHistory(),
        switchPath as RouteMatcher
    ),
    speech: speechDriver
})

/// #else
mkDriversCond = () => ({
    DOM: restartable(makeDOMDriver('#app'), {
        pauseSinksWhileReplaying: false
    }),
    HTTP: restartable(makeHTTPDriver()),
    time: timeDriver,
    router: makeRouterDriver(
        createBrowserHistory(),
        switchPath as RouteMatcher
    ),
    storage: storageDriver,
    speech: speechDriver
})
/// #endif
export const mkDrivers = mkDriversCond;

export type DriverSources = {
    DOM : DOMSource;
    HTTP : HTTPSource;
    time : TimeSource;
    router : RouterSource;
};

export type DriverSinks = Partial<{
    DOM : Stream<VNode>;
    HTTP : Stream<RequestOptions>;
    speech : Stream<string>;
    router : Stream<any>;
}>

export type Component = (s: DriverSources) => DriverSinks;
