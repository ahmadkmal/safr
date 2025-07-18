import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiService } from "../../services/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import { IAirportAndCity, IFlightOffer, IFlightOffers } from "../../types/flightTypes";
import { FlightSearchFormData } from "../../components/FlightSearchForm";
const generateId = (flightOffer: IFlightOffer) => {
  return (flightOffer.origin+flightOffer.destination+flightOffer.departureDate+flightOffer.returnDate+flightOffer.price.total).replace(/\s/g, '').replace(/-/g, '')
}
export const useFlightQuery = ({origin, departureDate}: {origin?: string, departureDate?: string}) => {
  return useQuery<IFlightOffers, Error, {data:(IFlightOffer & {id: string})[]}>({
    queryKey: ["flight", {origin, departureDate}],
    queryFn: () => apiService.getFlightOffers(origin!, departureDate!).then((response) => ({data: response?.data?.map((item) => ({...item, id: generateId(item)})) || [], meta: response?.meta})),
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: !!origin && !!departureDate,
  });
};

export const useAirportsAndCitiesQuery = ({keyword}: {keyword: string}) => {
  const [internalKeyword, setInternalKeyword] = useState(keyword);
  const debouncedSetKeyword = useCallback(
    debounce((value: string) => {
      setInternalKeyword(value);
    }, 300),
    []
  );
  useEffect(() => {
    debouncedSetKeyword(keyword);
  }, [keyword, debouncedSetKeyword]);

  return useQuery<{data: IAirportAndCity[], meta: any}, Error, IAirportAndCity[]>({
    queryKey: ["airportsAndCities", {keyword:internalKeyword}],
    queryFn: () => apiService.searchAirportsAndCities(internalKeyword),
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: !!internalKeyword && internalKeyword.length >= 2,
    select: (response) => response.data || [],
  });
};
export const useUpdateFlightOffer = (searchData: FlightSearchFormData) => {
  const queryClient = useQueryClient();
  const queryData = useMemo(() => {
    if (!searchData.originCode || !searchData.departureDate) {
      return { data: [] as IFlightOffer[], meta: null };
    }
    return queryClient.getQueryData<{data: IFlightOffer[], meta: any}>(["flight", {origin: searchData.originCode, departureDate: searchData.departureDate}]) || { data: [] as IFlightOffer[], meta: null };
  }, [searchData, queryClient]);
  
  const updatedData = useCallback((data: IFlightOffer|IFlightOffer[]) => {
    if (!queryData) {
      return;
    }
    if (Array.isArray(data)) {
      const newData = queryData.data.map((item) => {
        const foundData = data.find((d) => d.id === item.id);
        if ( foundData) {
          return foundData;
        }
        return item;
      });

      queryClient.setQueryData<{data:IFlightOffer[], meta: any}>(["flight", {origin: searchData.originCode, departureDate: searchData.departureDate}], {...queryData,data: newData});
      } else if (data.id) {  
        const newData = queryData.data.map((item) => {
        if ( item.id === data.id) {
          return data;
        }
        return item;
      });
      queryClient.setQueryData<{data:IFlightOffer[], meta: any}>(["flight", {origin: searchData.originCode, departureDate: searchData.departureDate}], {...queryData,data: newData});
      } else {

      }
  }, [queryData,queryClient,searchData]);
  return updatedData;
};