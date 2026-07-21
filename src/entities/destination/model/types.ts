export interface DestinationCity {
  name: string;
  slug: string;
  region?: { name: string; slug: string; type: string } | null;
}

export interface DestinationRegion {
  name: string;
  slug: string;
  type: string;
}

export interface DestinationCountry {
  name: string;
  slug: string;
  regions: DestinationRegion[];
  cities: DestinationCity[];
}
