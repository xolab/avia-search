import {Filters, SortOrder} from '../const';
import {Data} from '../types/data';

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

type Comparer = (prev: Data, next: Data) => number;

const byName = (nextSort: Comparer): Comparer => (prev, next) => {
  const cmp = prev.name.localeCompare(next.name);
  if (cmp === 0) {
    return nextSort(prev, next);
  } else {
    return cmp;
  }
};

const sortOrder = {
  [SortOrder.PRICEUP]: byName((prev, next) => Number(prev.price) - Number(next.price)),
  [SortOrder.PRICEDOWN]: byName((prev, next) => Number(next.price) - Number(prev.price)),
  [SortOrder.DURATION]: byName((prev, next) => Number(prev.totalDuration) - Number(next.totalDuration)),
};

export const getFilterList = (list: Data[], filters: Filters) => {
  const resultFilterSegment = (filters.numberSegments.length === 0)
    ? list
    : list
      .filter((item: Data) => filters.numberSegments
        .includes(String(item.totalSegments)));

  const priceFrom = filters.priceFrom === '' ? 0 : filters.priceFrom;
  const priceUpTo = filters.priceUpTo === '' ? 1000000 : filters.priceUpTo;
  const resultFilterPrice = resultFilterSegment
    .filter((item: Data) => item.price > priceFrom
      && item.price < priceUpTo);

  const comparer = sortOrder[filters.sortOrder];
  const sorted = [...resultFilterPrice].sort(comparer);

  const grouped = sorted.reduce((acc, el) => {
    if (acc.length === 0) {
      return [el];
    } else {
      const last = acc[acc.length - 1];
      if (comparer(el, last) !== 0) {
        acc.push(el);
      }
      return acc;
    }
  }, [] as Data[]);

  return grouped;
};
