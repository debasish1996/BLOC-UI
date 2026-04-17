import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling, TitleStrategy } from '@angular/router';
import { provideHighlightOptions } from 'ngx-highlightjs';

import { routes } from './app.routes';
import { SeoTitleStrategy } from './seo/seo';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
        { provide: TitleStrategy, useClass: SeoTitleStrategy },
        provideHighlightOptions({
            fullLibraryLoader: () => import('highlight.js'),
        }),
    ],
};
