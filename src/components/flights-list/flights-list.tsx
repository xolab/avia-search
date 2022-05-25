import {useState} from 'react';
import {FlightData} from '../../types/flightData';
import {getAdaptCardFlightList} from '../../utils/utils';
import './flights-list.css';

type Props = {
  listFlight: FlightData[],
}

function FlightsList({listFlight}: Props): JSX.Element {
  const [showMore, setShowMore] = useState(2);
  console.log((listFlight));

  return (
    <>
      <h2 className='visually-hidden'>Список рейсов</h2>
      <ul>
        {getAdaptCardFlightList(listFlight)
          // .slice(0, showMore)
          .map((item: any) => {
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
                    {legToDepartureCity.caption}, {legToDepartureAirport.caption} ({legToDepartureAirport.uid}) - {legToArrivalCity.caption}, {legToArrivalAirport.caption}, ({legToArrivalAirport.uid})
                  </p>
                  <p className="card__leg--date">
                    {legToDepartureDate} - {legToArrivalDate}
                  </p>
                  <p className="card__leg--segments">
                    {legToSegmentsNumber} пересадка
                  </p>
                  <p className="card__leg--airline">
                    Рейс выполняет: {legToAirline.caption}
                  </p>
                </div>
                <div className='card__leg'>
                  <p className="card__leg--title">
                    {legFromDepartureCity.caption}, {legFromDepartureAirport.caption}, ({legFromDepartureAirport.uid}) - {legFromArrivalCity.caption}, {legFromArrivalAirport.caption} ({legFromArrivalAirport.uid})
                  </p>
                  <p className="card__leg--date">
                    {legFromDepartureDate} - {legFromArrivalDate}
                  </p>
                  <p className="card__leg--segments">
                    {legFromSegmentsNumber - 1} пересадка
                  </p>
                  <p className="card__leg--airline">
                    Рейс выполняет: {legFromAirline.caption}
                  </p>
                </div>
                <button className="button-select" type="button">Выбрать</button>
              </li>
            );
          })}
        {showMore < listFlight.length && (
          <button
            className="button-more"
            type="button"
            onClick={() => setShowMore(showMore + 2)}
          >
            Показать еще
          </button>
        )}
      </ul>
    </>
  );
}

export default FlightsList;
