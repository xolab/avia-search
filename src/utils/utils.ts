import dayjs from 'dayjs';
import {useMemo} from 'react';
import {CommonFilters, FlightData, FlightFilters, SortOrder} from '../types';

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

const makeCommonFilterMatcher = (filters: CommonFilters) => (el: FlightData) => {
  const { numberSegments } = filters;
  const toNumber = (s: string) => s ? Number(s) : NaN;
  const priceFrom = toNumber(filters.priceFrom);
  const priceUpTo = toNumber(filters.priceUpTo);

  const matchesSegments = numberSegments.length === 0 || numberSegments.includes(String(el.totalSegments));
  const matchesPriceFrom = isNaN(priceFrom) || el.price >= priceFrom;
  const matchesPriceUpTo = isNaN(priceUpTo) || el.price <= priceUpTo;

  return matchesSegments && matchesPriceFrom && matchesPriceUpTo;
};

const makeFlightFiltersMatcher = (filters: FlightFilters) => {
  const commonMatcher = makeCommonFilterMatcher(filters);
  return (el: FlightData) => {
    if (commonMatcher(el)) {
      const { carrierNames } = filters;
      return carrierNames.length === 0 || carrierNames.includes(el.name);
    }
    return false;
  };
};

export const useCarriersList = (list: FlightData[], filters: CommonFilters) => useMemo(() => {
  const comparerUniq = byName(sortOrder[SortOrder.PRICEUP]);

  const sortedUniq = [...list].sort(comparerUniq);

  const matchesFilters = makeCommonFilterMatcher(filters);
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

const flightToAdaptCard = (flight: FlightData) => {
  const legToFirst = flight.legTo[0];
  const legToLast = flight.legTo[(flight.legTo.length - 1)];
  const legToSegmentsNumber = flight.legTo.length - 1;

  const legFromFirst = flight.legFrom[0];
  const legFromLast = flight.legFrom[(flight.legFrom.length - 1)];
  const legFromSegmentsNumber = flight.legFrom.length - 1;

  const adaptCardFlight = {
    id: flight.id,
    priceFlight: flight.price,
    legToAirline: legToFirst.airline,
    legToSegmentsNumber,
    legToDepartureAirport: legToFirst.departureAirport,
    legToDepartureCity: legToFirst.departureCity,
    legToDepartureDate: legToFirst.departureDate,
    legToArrivalAirport: legToLast.arrivalAirport,
    legToArrivalCity: legToLast.arrivalCity,
    legToArrivalDate: legToLast.arrivalDate,

    legFromAirline: legToFirst.airline,
    legFromSegmentsNumber,
    legFromDepartureAirport: legFromFirst.departureAirport,
    legFromDepartureCity: legFromFirst.departureCity,
    legFromDepartureDate: legFromFirst.departureDate,
    legFromArrivalAirport: legFromLast.arrivalAirport,
    legFromArrivalCity: legFromLast.arrivalCity,
    legFromArrivalDate: legFromLast.arrivalDate,
  };

  return adaptCardFlight;
};

export const useFlightsList = (list: FlightData[], filters: FlightFilters, count: number) =>
  useMemo(
    () => {
      const filtered = list
        .filter(makeFlightFiltersMatcher(filters))
        .sort(sortOrder[filters.sortOrder])
        .map(flightToAdaptCard);

      return {
        list: filtered.slice(0, count),
        totalFiltered: filtered.length,
        showMore: count < filtered.length,
      };
    },
    [list, filters, count],
  );

  export const getDiffDuration = (dateEnd: any, dateStart: any) => dayjs(dateEnd).diff(dayjs(dateStart));

export const getDurationFormated = (dateStart: any, dateEnd: any) => {
  const diffDuration = (dateEnd !== undefined) ? getDiffDuration(dateEnd, dateStart) : dateStart;
  let minutes = Math.floor(diffDuration / 60000);
  let hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  const days = Math.floor(hours / 24);
  hours = hours % 24;

  const diffDays = days > 0 ? `${(`00${days}`).slice(-2)} дн` : '';

  let diffHours = '';
  if(hours > 0) {
    diffHours = `${(`00${hours}`).slice(-2)} ч`;
  } else {
    if(days > 0) {
      diffHours = '00 ч';
    }
  }
  const diffMinutes = minutes > 0 ? `${(`00${minutes}`).slice(-2)} мин` : '00 мин';

  return `${diffDays} ${diffHours} ${diffMinutes}`;
};
