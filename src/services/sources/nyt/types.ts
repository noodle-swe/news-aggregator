/** Legacy multimedia shape: an array of renditions with site-relative URLs. */
export interface NytLegacyMedia {
  url: string;
  subtype?: string;
  width?: number;
}

/** 2025+ multimedia shape: a single object with absolute rendition URLs. */
export interface NytMediaObject {
  default?: { url: string };
  thumbnail?: { url: string };
}

export interface NytDoc {
  _id: string;
  web_url: string;
  abstract?: string;
  snippet?: string;
  lead_paragraph?: string;
  pub_date: string;
  section_name?: string;
  headline: { main: string };
  byline?: { original?: string | null };
  multimedia?: NytLegacyMedia[] | NytMediaObject | null;
}

export interface NytResponse {
  response: {
    docs: NytDoc[] | null;
    /** Called `meta` before the 2025 API update and `metadata` after it. */
    meta?: { hits: number };
    metadata?: { hits: number };
  };
}
