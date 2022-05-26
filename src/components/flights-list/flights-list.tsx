import dayjs from 'dayjs';
import {memo, useEffect, useState} from 'react';
import {FlightData, FlightFilters} from '../../types';
import {getDurationFormated, useFlightsList} from '../../utils/utils';
import './flights-list.css';

type Props = {
  listFlight: FlightData[];
  filters: FlightFilters;
}

const SHOW_MORE_CNT = 2;

const FlightsList = memo(({listFlight, filters}: Props) => {
  const [showCount, setShowCount] = useState(SHOW_MORE_CNT);

  const { list, showMore, totalFiltered } = useFlightsList(listFlight, filters, showCount);

  useEffect(() => {
    setShowCount(SHOW_MORE_CNT);
  }, [listFlight, filters]);

  return (
    <>
      <h2 className='visually-hidden'>Список рейсов: {totalFiltered}</h2>
      <ul>
        {list
          .map((item) => {
            const {
              id,
              priceFlight,
              legToAirline,
              legToSegmentsNumber,
              legToDepartureCity,
              legToDepartureAirport,
              legToDepartureDate,
              legToArrivalCity,
              legToArrivalAirport,
              legToArrivalDate,
              legFromAirline,
              legFromSegmentsNumber,
              legFromDepartureCity,
              legFromDepartureAirport,
              legFromDepartureDate,
              legFromArrivalCity,
              legFromArrivalAirport,
              legFromArrivalDate,
            } = item;

            return (
              <li className="flight-card" key={id}>
                <div className="card__title">
                  <p className="card__title--price">
                    {priceFlight} ₽
                  </p>
                  <p className="card__title--text">
                    Стоимость для одного взрослого пассажира
                  </p>
                </div>
                <div className="card__leg">
                  <p className="card__leg--title">
                    {legToDepartureCity.caption}, {legToDepartureAirport.caption} ({legToDepartureAirport.uid}) &rarr; {legToArrivalCity.caption}, {legToArrivalAirport.caption}, ({legToArrivalAirport.uid})
                  </p>
                  <p className="card__leg--date">
                    {dayjs(legToDepartureDate).format('HH:mm')} {' '}
                    {dayjs(legToDepartureDate).format('DD MMM')} {' '}
                    {dayjs(legToDepartureDate).format('dd')}
                    &emsp;&#128339;&emsp;
                    {getDurationFormated(legToDepartureDate, legToArrivalDate)} &emsp;
                    {dayjs(legToArrivalDate).format('DD MMM')} {' '}
                    {dayjs(legToArrivalDate).format('dd')} {' '}
                    {dayjs(legToArrivalDate).format('HH:mm')}
                  </p>
                  <p className="card__leg--segments">
                    {legToSegmentsNumber === 0
                      ? '-------------------------'
                      : `${legToSegmentsNumber} пересадка`}
                  </p>
                  <p className="card__leg--airline">
                    Рейс выполняет: {legToAirline.caption}
                  </p>
                </div>
                <div className='card__leg'>
                  <p className="card__leg--title">
                    {legFromDepartureCity.caption}, {legFromDepartureAirport.caption}, ({legFromDepartureAirport.uid}) &rarr; {legFromArrivalCity.caption}, {legFromArrivalAirport.caption} ({legFromArrivalAirport.uid})
                  </p>
                  <p className="card__leg--date">
                    {dayjs(legFromDepartureDate).format('HH:mm')} {' '}
                    {dayjs(legFromDepartureDate).format('DD MMM')} {' '}
                    {dayjs(legFromDepartureDate).format('dd')}
                    &emsp;&#128339;&emsp;
                    {getDurationFormated(legFromDepartureDate, legFromArrivalDate)} &emsp;
                    {dayjs(legFromArrivalDate).format('DD MMM')} {' '}
                    {dayjs(legFromArrivalDate).format('dd')} {' '}
                    {dayjs(legFromArrivalDate).format('HH:mm')}
                  </p>
                  <p className="card__leg--segments">
                    {legFromSegmentsNumber === 0
                      ? '-------------------------'
                      : `${legFromSegmentsNumber} пересадка`}
                  </p>
                  <p className="card__leg--airline">
                    Рейс выполняет: {legFromAirline.caption}
                  </p>
                </div>
                <button className="button-select" type="button">Выбрать</button>
              </li>
            );
          })}
        {showMore && (
          <button
            className="button-more"
            type="button"
            onClick={() => setShowCount(showCount + SHOW_MORE_CNT)}
          >
            Показать еще
          </button>
        )}
      </ul>
    </>
  );
});

FlightsList.displayName = 'FlightsList';

export default FlightsList;
