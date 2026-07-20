export interface Warning {
  id: number;
  title: string;
  category: string;
  risk: string;
  type: string;
  range: string;
  reason: string;
  alternative: string;
  diffFromKorea?: string;
  checkNeeded?: string;
  locations: string[];
}
