import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, TitleStrategy } from '@angular/router';
import { provideHighlightOptions } from 'ngx-highlightjs';

import { routes } from './app.routes';
import { SeoTitleStrategy } from './seo/seo';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        { provide: TitleStrategy, useClass: SeoTitleStrategy },
        provideHighlightOptions({
            fullLibraryLoader: () => import('highlight.js'),
        }),
    ],
};
