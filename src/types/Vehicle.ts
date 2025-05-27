export type Vehicle = {
    id: number;
    year: number;
    vin: string;
    location: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      lat?: number;
      lng?: number;
    };
    sold: boolean;
    favorite: boolean;
    model: {
      id: number;
      name: string;
    };
    make: {
      id: number;
      name: string;
    };
}