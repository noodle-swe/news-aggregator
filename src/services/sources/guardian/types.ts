export interface GuardianResult {
  id: string;
  sectionName: string;
  webPublicationDate: string;
  webTitle: string;
  webUrl: string;
  fields?: {
    thumbnail?: string;
    trailText?: string;
    byline?: string;
  };
}

export interface GuardianResponse {
  response: {
    status: 'ok';
    total: number;
    currentPage: number;
    pages: number;
    results: GuardianResult[];
  };
}
