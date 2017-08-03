// tslint:disable-next-line
/// <reference path="node_modules/snabbdom-pragma/snabbdom-pragma.d.ts" />
declare module 'cycle-restart';

declare var Snabbdom : any; //Automaticly imported into every file

declare module '@cycle/storage' // TODO PR to add missing typeings

declare type RouterSink = Stream<string | object> // TODO PR upstream
