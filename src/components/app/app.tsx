import {useEffect, useState} from 'react';
import {Filters, SortOrder} from '../../const';
import {Data} from '../../types/data';
import {getArrayFlights, getFilterList} from '../../utils/utils';
import CarriersList from '../carriers-list/carriers-list';
import FlightsList from '../flights-list/flights-list';
import './app.css';

enum NumberSegments {
  NOSEGMENTS = '2',
  ONESEGMENT = '3',
}

function App(): JSX.Element {
  const [listFlight, setListFlight] = useState<Data[]>([]);
  const [filteredList, setFilteredList] = useState<Data[]>([]);
  const [filters, setFilters] = useState<Filters>({
    sortOrder: SortOrder.PRICEUP,
    numberSegments: [],
    priceFrom: '',
    priceUpTo: '',
  });

  // console.log(listFlight);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredList(getFilterList(listFlight, filters));
  }, [filters, listFlight]);

  const fetchData = async () => {
    await fetch('./flights.json')
      .then((responce) => responce.json())
      .then((flights) => {
        // console.log('list:', flights.result.flights);
        setListFlight(getArrayFlights(flights.result.flights));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSortOrder = (evt: any) => {
    const {value} = evt.target;
    setFilters({
      ...filters,
      sortOrder: value,
    });
  };

  const handleNumberSegment = (evt: any) => {
    const {name} = evt.target;
    const {numberSegments} = filters;
    if(numberSegments.includes(String(name))) {
      setFilters({
        ...filters,
        numberSegments: numberSegments.filter((item) => item !== String(name)),
      });
    } else {
      setFilters({
        ...filters,
        numberSegments: [...numberSegments, String(name)],
      });
    }
  };

  const handlePrice = (evt: any) => {
    const {name, value} = evt.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  return (
    <main className='page-main'>
      <h1 className='visually-hidden'>Система подбора авиабилетов Avia Search</h1>
      <div className="page-container">
        <section className='page-sort'>
          <h2>Сортировать</h2>
          <ul>
            <li>
              <label>
                <input
                  type="radio"
                  name="sort"
                  value={SortOrder.PRICEUP}
                  checked={filters.sortOrder === SortOrder.PRICEUP}
                  onChange={handleSortOrder}
                />
            - по возрастанию цены
              </label>
            </li>
            <li>
              <label>
                <input
                  type="radio"
                  name="sort"
                  value={SortOrder.PRICEDOWN}
                  checked={filters.sortOrder === SortOrder.PRICEDOWN}
                  onChange={handleSortOrder}
                />
            - по убыванию цены
              </label>
            </li>
            <li>
              <label>
                <input
                  type="radio"
                  name="sort"
                  value={SortOrder.DURATION}
                  checked={filters.sortOrder === SortOrder.DURATION}
                  onChange={handleSortOrder}
                />
            - по времени в пути
              </label>
            </li>
          </ul>
          <h2>Фильтровать</h2>
          <ul>
            <li>
              <label>
                <input
                  type="checkbox"
                  name={NumberSegments.ONESEGMENT}
                  checked={filters.numberSegments.includes(NumberSegments.ONESEGMENT)}
                  onChange={handleNumberSegment}
                />
            - 1 пересадка
              </label>
            </li>
            <li>
              <label>
                <input
                  type="checkbox"
                  name={NumberSegments.NOSEGMENTS}
                  checked={filters.numberSegments.includes(NumberSegments.NOSEGMENTS)}
                  onChange={handleNumberSegment}
                />
            - без пересадок
              </label>
            </li>
          </ul>
          <h2>Цена</h2>
          <p>
            <label>
              От
              <input
                type="text"
                name="priceFrom"
                placeholder='0'
                value={filters.priceFrom}
                onChange={handlePrice}
              />
            </label>
          </p>
          <p>
            <label>
              До
              <input
                type="text"
                name="priceUpTo"
                placeholder='1000000'
                value={filters.priceUpTo}
                onChange={handlePrice}
              />
            </label>
          </p>
          <CarriersList filteredList={filteredList}/>
        </section>
        <section className='flights-list'>
          <FlightsList listFlight={listFlight}/>
        </section>
      </div>
    </main>
  );
}

export default App;
