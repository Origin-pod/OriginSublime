// src/types.ts
export interface ScrapedArticle {
    title: string;
    url: string;
    source: string;
    publishedAt?: Date;
    rawContent?: string;
}
