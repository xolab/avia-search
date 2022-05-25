import {useMemo} from 'react';
import {CommonFilters, FlightFilters, SortOrder} from '../const';
import {FlightData} from '../types/flightData';

export const getArrayFlights = (flights: Record<string, unknown>[]) => flights
  .map((flight: any, index) => {
    let totalSegments = 0;
    const totalDuration = flight.flight.legs
      .reduce((acc: any, leg: any) => {
        totalSegments = totalSegments + leg.segments.length;
        return acc + leg.duration;
      }, 0);

    const legTo = flight.flight.legs[0].segments;

    const legFrom = flight.flight.legs[1].segments;

    return {
      totalSegments,
      id: index,
      name: flight.flight.carrier.caption,
      price: Number(flight.flight.price.total.amount),
      legTo,
      legFrom,
      totalDuration,
    };
  });

type Comparer = (prev: FlightData, next: FlightData) => number;

const byName = (nextSort: Comparer): Comparer => (prev, next) => {
  const cmp = prev.name.localeCompare(next.name);
  if (cmp === 0) {
    return nextSort(prev, next);
  } else {
    return cmp;
  }
};

const sortOrder: Record<SortOrder, Comparer> = {
  [SortOrder.PRICEUP]: (prev, next) => Number(prev.price) - Number(next.price),
  [SortOrder.PRICEDOWN]: (prev, next) => Number(next.price) - Number(prev.price),
  [SortOrder.DURATION]: (prev, next) => Number(prev.totalDuration) - Number(next.totalDuration),
};

export type CarrierGroup = {
  name: string;
  minPrice: number;
  enabled: boolean;
};

export const useCarriersList = (list: FlightData[], filters: CommonFilters) => useMemo(() => {
  const comparerUniq = byName(sortOrder[SortOrder.PRICEUP]);

  const sortedUniq = [...list].sort(comparerUniq);

  const matchesFilters = (el: FlightData) => {
    const { numberSegments } = filters;
    const toNumber = (s: string) => s ? Number(s) : NaN;
    const priceFrom = toNumber(filters.priceFrom);
    const priceUpTo = toNumber(filters.priceUpTo);

    const matchesSegments = numberSegments.length === 0 || numberSegments.includes(String(el.totalSegments));
    const matchesPriceFrom = isNaN(priceFrom) || el.price >= priceFrom;
    const matchesPriceUpTo = isNaN(priceUpTo) || el.price <= priceUpTo;

    return matchesSegments && matchesPriceFrom && matchesPriceUpTo;
  };

  const carrierGroups = sortedUniq.reduce((acc, el) => {
    const newGroup = {
      name: el.name,
      minPrice: el.price,
      enabled: matchesFilters(el),
    };

    if (acc.length === 0) {
      return [newGroup];
    } else {
      const last = acc[acc.length - 1];
      if (last.name !== el.name) {
        acc.push(newGroup);
        return acc;
      } else {
        last.minPrice = Math.min(last.minPrice, el.price);
        last.enabled = last.enabled || matchesFilters(el);
        return acc;
      }
    }
  }, [] as CarrierGroup[]);


  return carrierGroups;
}, [list, filters]);

export const useFlightsList = (list: FlightData[], filters: FlightFilters) => useMemo(() => list.filter((el) => {
  const { numberSegments } = filters;
  const toNumber = (s: string) => s ? Number(s) : NaN;
  const priceFrom = toNumber(filters.priceFrom);
  const priceUpTo = toNumber(filters.priceUpTo);

  const matchesSegments = numberSegments.length === 0 || numberSegments.includes(String(el.totalSegments));
  const matchesPriceFrom = isNaN(priceFrom) || el.price >= priceFrom;
  const matchesPriceUpTo = isNaN(priceUpTo) || el.price <= priceUpTo;

  const matchesNames = filters.carrierNames.length === 0 || filters.carrierNames.includes(el.name);

  return matchesSegments && matchesPriceFrom && matchesPriceUpTo && matchesNames;

}), [list, filters]);

export const getAdaptCardFlightList = (listFlight: FlightData[]) => listFlight.reduce((acc: any, flight) => {
  const adaptCardFlight = {
    id: flight.id,
    priceFlight: flight.price,
    legToAirline: flight.legTo[0].airline,
    legToSegmentsNumber: flight.legTo.length - 1,
    legToDepartureAirport: flight.legTo[0].departureAirport,
    legToDepartureCity: flight.legTo[0].departureCity,
    legToDepartureDate: flight.legTo[0].departureDate,
    legToArrivalAirport: flight.legTo[(flight.legTo.length - 1)].departureAirport,
    legToArrivalCity: flight.legTo[(flight.legTo.length - 1)].departureCity,
    legToArrivalDate: flight.legTo[(flight.legTo.length - 1)].departureDate,
    legFromAirline: flight.legFrom[0].airline,
    legFromSegmentsNumber: flight.legFrom.length - 1,
    legFromDepartureAirport: flight.legFrom[0].arrivalAirport,
    legFromDepartureCity: flight.legFrom[0].arrivalCity,
    legFromDepartureDate: flight.legFrom[0].arrivalDate,
    legFromArrivalAirport: flight.legFrom[(flight.legFrom.length - 1)].arrivalAirport,
    legFromArrivalCity: flight.legFrom[(flight.legFrom.length - 1)].arrivalCity,
    legFromArrivalDate: flight.legFrom[(flight.legFrom.length - 1)].arrivalDate,
  };

  acc.push(adaptCardFlight);
  return acc;
}, []);
