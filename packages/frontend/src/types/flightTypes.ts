export interface IAirportAndCity {
    address: {
        cityName: string;
        cityCode: string;
        countryName: string;
        countryCode: string;
    };
    analytics: {
        travelers: {
            score: number;
        };
    };  
    detailedName: string;
    geoCode: {
        latitude: number;
        longitude: number;
    };
    iataCode: string;
    id: string;
    name: string;
    self: {
        href: string;
        methods: string[];
    };
    subType: string;
    timeZoneOffset: string;
    type: string;
}
export interface IFlightOffer {
    departureDate: string;
    destination: string;
    links: {
        flightDates: string;
        flightOffers: string;
    };
    origin: string;
    price: {
        total: string;
    };
    returnDate: string;
    type: string;
    id: string;
}


export interface IFlightOffers {
    data: IFlightOffer[];
    meta: {
        count: number;
    };
}