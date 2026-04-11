import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

const SITE_NAME = 'Bloc UI';
const SITE_URL = 'https://ui.bloc-verse.com';
const DEFAULT_DESCRIPTION =
    'Bloc UI is a lightweight, themeable, and accessible Angular component library with zero-specificity base styles.';
const DEFAULT_IMAGE = `${SITE_URL}/favicon.ico`;

export interface RouteSeo {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoTitleStrategy extends TitleStrategy {
    private readonly title = inject(Title);
    private readonly meta = inject(Meta);
    private readonly doc = inject(DOCUMENT);

    override updateTitle(snapshot: RouterStateSnapshot): void {
        const data = (snapshot.root.firstChild?.data ?? {}) as {
            title?: string;
            description?: string;
            keywords?: string;
            image?: string;
        };

        const pageTitle = data.title ?? this.buildTitleFromUrl(snapshot.url);
        const fullTitle = pageTitle.includes(SITE_NAME) ? pageTitle : `${pageTitle} — ${SITE_NAME}`;
        const description = data.description ?? DEFAULT_DESCRIPTION;
        const image = data.image ?? DEFAULT_IMAGE;
        const url = `${SITE_URL}${snapshot.url === '/' ? '' : snapshot.url}`;

        this.title.setTitle(fullTitle);

        this.setTag('name', 'description', description);
        if (data.keywords) {
            this.setTag('name', 'keywords', data.keywords);
        }

        this.setTag('property', 'og:title', fullTitle);
        this.setTag('property', 'og:description', description);
        this.setTag('property', 'og:type', 'website');
        this.setTag('property', 'og:url', url);
        this.setTag('property', 'og:image', image);
        this.setTag('property', 'og:site_name', SITE_NAME);

        this.setTag('name', 'twitter:card', 'summary_large_image');
        this.setTag('name', 'twitter:title', fullTitle);
        this.setTag('name', 'twitter:description', description);
        this.setTag('name', 'twitter:image', image);

        this.setLinkCanonical(url);
    }

    private setTag(attr: 'name' | 'property', key: string, value: string): void {
        this.meta.updateTag({ [attr]: key, content: value });
    }

    private setLinkCanonical(url: string): void {
        let link = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        if (!link) {
            link = this.doc.createElement('link');
            link.setAttribute('rel', 'canonical');
            this.doc.head.appendChild(link);
        }
        link.setAttribute('href', url);
    }

    private buildTitleFromUrl(url: string): string {
        const path = url.split('?')[0].replace(/^\//, '');
        if (!path) return SITE_NAME;
        return path
            .split('-')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
    }
}
