// tslint:disable-next-line
/// <reference path="node_modules/snabbdom-pragma/snabbdom-pragma.d.ts" />
declare module 'cycle-restart';

declare var Snabbdom : any; //Automaticly imported into every file

declare module '@cycle/storage' // TODO PR to add missing typeings

declare module 'cyclejs-auth0' // TODO PR to add missing typeings
declare class Stream<T> {}
type Auth0Action = object
declare interface Auth0Source {
    select: Stream<any>
    token$: Stream<any>
}
declare type Auth0Sink = Stream<Auth0Action> 
type Auth0Driver = (action$: Stream<Auth0Action>) => Auth0Source
declare function makeAuth0Driver(appkey: string, appdomain: string): Auth0Driver

declare type RouterSink = Stream<string | object> // TODO PR upstream
