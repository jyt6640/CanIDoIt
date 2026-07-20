export interface DestinationCity {
  name: string;
  slug: string;
}

export interface DestinationCountry {
  name: string;
  slug: string;
  cities: DestinationCity[];
}
