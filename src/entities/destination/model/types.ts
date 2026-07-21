export interface DestinationCity {
  name: string;
  slug: string;
  priorityScore: number;
  contentStatus: 'AVAILABLE' | 'PARTIAL' | 'IN_REVIEW' | 'REQUESTED' | 'NO_VERIFIED_DATA';
  region?: { name: string; slug: string; type: string } | null;
}

export interface DestinationRegion {
  name: string;
  slug: string;
  type: string;
  priorityScore: number;
  contentStatus: 'AVAILABLE' | 'PARTIAL' | 'IN_REVIEW' | 'REQUESTED' | 'NO_VERIFIED_DATA';
}

export interface DestinationCountry {
  name: string;
  slug: string;
  priorityScore: number;
  contentStatus: 'AVAILABLE' | 'PARTIAL' | 'IN_REVIEW' | 'REQUESTED' | 'NO_VERIFIED_DATA';
  prioritySource?: string | null;
  priorityCheckedAt?: string | null;
  regions: DestinationRegion[];
  cities: DestinationCity[];
}
