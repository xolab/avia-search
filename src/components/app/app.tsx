import {useEffect, useMemo, useState} from 'react';
import {CommonFilters, FlightData, FlightFilters, SortOrder} from '../../types';
import {getArrayFlights, useCarriersList} from '../../utils/utils';
import CarriersList from '../carriers-list/carriers-list';
import FlightsList from '../flights-list/flights-list';
import './app.css';

enum NumberSegments {
  NOSEGMENTS = '2',
  ONESEGMENT = '3',
}

function App(): JSX.Element {
  useEffect(() => {
    fetchData();
  }, []);

  const [carriersSelected, setCarriersSelected] = useState<Record<string, boolean>>({});

  const handleCarrierSelect = (name: string, checked: boolean) => {
    setCarriersSelected((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const [listFlight, setListFlight] = useState<FlightData[]>([]);
  const [carrierFilters, setCarrierFilters] = useState<CommonFilters>({
    sortOrder: SortOrder.PRICEUP,
    numberSegments: [],
    priceFrom: '',
    priceUpTo: '',
  });

  const carriersList = useCarriersList(listFlight, carrierFilters);

  const flightFilters = useMemo((): FlightFilters => {

    const carrierNames = Object.keys(carriersSelected).filter((name) =>
      carriersSelected[name] &&
      carriersList.find((group) => group.name === name && group.enabled));

    return {
      ...carrierFilters,
      carrierNames,
    };
  }, [carrierFilters, carriersSelected, carriersList]);

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
    setCarrierFilters({
      ...carrierFilters,
      sortOrder: value,
    });
  };

  const handleNumberSegment = (evt: any) => {
    const {name} = evt.target;
    const {numberSegments} = carrierFilters;
    if(numberSegments.includes(String(name))) {
      setCarrierFilters({
        ...carrierFilters,
        numberSegments: numberSegments.filter((item) => item !== String(name)),
      });
    } else {
      setCarrierFilters({
        ...carrierFilters,
        numberSegments: [...numberSegments, String(name)],
      });
    }
  };

  const handlePrice = (evt: any) => {
    const {name, value} = evt.target;
    setCarrierFilters({
      ...carrierFilters,
      [name]: value,
    });
  };

  return (
    <main className='page-main'>
      <h1 className='visually-hidden'>?????????????? ?????????????? ?????????????????????? Avia Search</h1>
      <div className="page-container">
        <section className='page-sort'>
          <h2 className="sort__title">??????????????????????</h2>
          <ul className="sort__list">
            <li className="sort__item">
              <label>
                <input
                  type="radio"
                  name="sort"
                  value={SortOrder.PRICEUP}
                  checked={carrierFilters.sortOrder === SortOrder.PRICEUP}
                  onChange={handleSortOrder}
                />
            - ???? ?????????????????????? ????????
              </label>
            </li>
            <li className="sort__item">
              <label>
                <input
                  type="radio"
                  name="sort"
                  value={SortOrder.PRICEDOWN}
                  checked={carrierFilters.sortOrder === SortOrder.PRICEDOWN}
                  onChange={handleSortOrder}
                />
            - ???? ???????????????? ????????
              </label>
            </li>
            <li className="sort__item">
              <label>
                <input
                  type="radio"
                  name="sort"
                  value={SortOrder.DURATION}
                  checked={carrierFilters.sortOrder === SortOrder.DURATION}
                  onChange={handleSortOrder}
                />
            - ???? ?????????????? ?? ????????
              </label>
            </li>
          </ul>
          <h2 className="filters__title">??????????????????????</h2>
          <ul className="filters__list">
            <li className="filters__item">
              <label>
                <input
                  type="checkbox"
                  name={NumberSegments.ONESEGMENT}
                  checked={carrierFilters.numberSegments.includes(NumberSegments.ONESEGMENT)}
                  onChange={handleNumberSegment}
                />
            - 1 ??????????????????
              </label>
            </li>
            <li>
              <label>
                <input
                  type="checkbox"
                  name={NumberSegments.NOSEGMENTS}
                  checked={carrierFilters.numberSegments.includes(NumberSegments.NOSEGMENTS)}
                  onChange={handleNumberSegment}
                />
            - ?????? ??????????????????
              </label>
            </li>
          </ul>
          <h2 className="prices__title">????????</h2>
          <p className="prices__item">
            <label htmlFor="priceFrom">
              ????
            </label>
            <input
              className="prices__from--input"
              id="priceFrom"
              type="text"
              name="priceFrom"
              placeholder='0'
              value={carrierFilters.priceFrom}
              onChange={handlePrice}
            />
          </p>
          <p className="prices__item">
            <label htmlFor="priceUpTo">
              ????
            </label>
            <input
              className="prices__from--input"
              id="priceUpTo"
              type="text"
              name="priceUpTo"
              placeholder="1000000"
              value={carrierFilters.priceUpTo}
              onChange={handlePrice}
            />
          </p>
          <h2 className="carriers__title">???????????????????????? ({carriersList.length} ????.)</h2>
          <CarriersList carriersList={carriersList} carriersSelected={carriersSelected} onCheck={handleCarrierSelect} />
        </section>
        <section className="flights-list">
          <FlightsList listFlight={listFlight} filters={flightFilters} />
        </section>
      </div>
    </main>
  );
}

export default App;
