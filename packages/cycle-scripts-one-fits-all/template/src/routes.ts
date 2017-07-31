import { Component } from './drivers';

import { Page1 } from './pages/page1';
import { Page2 } from './pages/page2';

export interface RouteValue {
    page : Component;
    scope : string;
}
export interface Routes {
    readonly [index : string]: RouteValue;
}

export const routes : Routes = {
    '/': { page: Page1, scope: 'page1' },
    '/p2': { page: Page2, scope: 'page2' }
};

export const initialRoute = '/';