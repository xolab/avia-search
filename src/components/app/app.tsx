import {useState} from 'react';
import {Filters, SortOrder} from '../../const';
import CarriersList from '../carriers-list/carriers-list';
import './app.css';

enum NumberSegments {
  NOSEGMENTS = '2',
  ONESEGMENT = '3',
}

function App(): JSX.Element {
  const [filters, setFilters] = useState<Filters>({
    sortOrder: SortOrder.PRICEUP,
    numberSegments: [],
    priceFrom: '',
    priceUpTo: '',
  });

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
          <CarriersList  filters={filters}/>
        </section>
        <section className='flight-list'>
          <h2 className='visually-hidden'>Список рейсов</h2>
          <div className="flight-card">
            <p>
              21049 Р
            </p>
            <p>
              Стоимость для одного взрослого пассажира
            </p>
            <p>
              Москва, ШЕРЕМЕТЬЕВО (SVO) - ЛОНДОН, Лондон, Хитроу (LHR)
            </p>
            <p>
              20:40 18 авг. вт 14 ч 45 мин 19 авг. ср 09:25
            </p>
            <p>
              1 пересадка
            </p>
            <p>
              Рейс выполняет: LOT Polish Airlines
            </p>
            <p>
              ЛОНДОН, Лондон, Хитроу (LHR) - Москва, ШЕРЕМЕТЬЕВО (SVO)
            </p>
            <p>
            18:10 19 авг. ср 23 ч 35 мин 20 авг. чт 19:45
            </p>
            <p>
            1 пересадка
            </p>
            <p>
              Рейс выполняет: LOT Polish Airlines
            </p>
            <button type="button">ВЫБРАТЬ</button>
          </div>

        </section>
      </div>
    </main>
  );
}

export default App;
