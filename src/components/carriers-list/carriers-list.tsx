import {useEffect, useState} from 'react';
import {Filters, SortOrder} from '../../const';
import {Data} from '../../types/data';
import {getArrayFlights} from '../../utils/utils';

const sortOrder = {
  [SortOrder.PRICEUP]: (prev: Data, next: Data) => Number(prev.price) - Number(next.price),
  [SortOrder.PRICEDOWN]: (prev: Data, next: Data) => Number(next.price) - Number(prev.price),
  [SortOrder.DURATION]: (prev: Data, next: Data) => Number(prev.totalDuration) - Number(next.totalDuration),
};

const getFilterList = (list: Data[], filters: Filters) => {
  const resultFilterSegment = (filters.numberSegments.length === 0)
    ? list
    : list
      .filter((item: Data) => filters.numberSegments
        .includes(String(item.totalSegments)));

  const resultFilterPrice = (filters.priceFrom === '')
    ? resultFilterSegment
    : resultFilterSegment
      .filter((item: Data) => (Number(item.price) > Number(filters.priceFrom)
      && Number(item.price) < Number(filters.priceUpTo)));

  const resultSort = [...resultFilterPrice].sort(sortOrder[filters.sortOrder]);

  return resultSort;
};

type ComponentProps = {
  filters: Filters,
}

function CarriersList({filters}: ComponentProps): JSX.Element {
  const [list, setData] = useState<Data[]>([]);
  const [filteredList, setFilteredList] = useState<Data[]>([]);


  useEffect(() => {
    if(list.length === 0) {
      fetchData();
    }
  }, [list.length]);

  useEffect(() => {
    setFilteredList(getFilterList(list, filters));
  }, [filters, list]);

  const fetchData = async () => {
    await fetch('./flights.json')
      .then((responce) => responce.json())
      .then((flights) => {
        // console.log('list:', flights.result.flights);
        setData(getArrayFlights(flights.result.flights));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <h2>Авиакомпании ({filteredList.length} шт.)</h2>
      <ul>
        {filteredList.map((item: Data, index) => {
          const {id, legFrom, legTo, name, price, totalDuration} = item;

          return (
            <li key={id}>
              <label>
                <input type="checkbox" name="nameCompany" />
                {`- ${name} от ${price} р.`}
              </label>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default CarriersList;
