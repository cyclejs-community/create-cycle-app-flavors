import { Component } from './drivers';

import { Page1 } from './pages/page1';
import { Page2 } from './pages/page2';

export interface Routes {
    readonly [index : string]: Component;
}

export const routes : Routes = {
    '/': Page1,
    '/p2': Page2
};

export const initialRoute = '/';
