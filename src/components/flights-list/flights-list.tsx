import {useState} from 'react';
import {Data} from '../../types/data';

type ComponentProps = {
  listFlight: Data[],
}

function FlightsList({listFlight}: ComponentProps): JSX.Element {
  const [showMore, setShowMore] = useState(2);

  return (
    <>
      <h2 className='visually-hidden'>Список рейсов</h2>
      <ul>
        {listFlight
          .slice(0, showMore)
          .map((item: Data) => {
            const {id, legFrom, legTo, price, totalDuration} = item;
            const {
              airline: airlinelegTo,
              departureCity: departureCitylegTo,
              departureAirport: departureAirportlegTo,
            } = legTo[0];
            const {arrivalCity: arrivalCitylegTo, arrivalAirport: arrivalAirportlegTo} = legTo[1];
            const {
              airline: airlinelegFrom,
              departureCity: departureCitylegFrom,
              departureAirport: departureAirportlegFrom,
            } = legFrom[0];
            const {arrivalCity: arrivalCitylegFrom, arrivalAirport: arrivalAirportlegFrom} = legFrom[1];

            return (
              <li className="flight-card" key={id}>
                <div className="card-title">
                  <p>
                    {price} ₽
                  </p>
                  <p>
                    Стоимость для одного взрослого пассажира
                  </p>
                </div>
                <div className='card-leg'>
                  <p>
                    {departureCitylegTo.caption}, {departureAirportlegTo.caption} ({departureAirportlegTo.uid}) - {arrivalCitylegTo.caption}, {arrivalAirportlegTo.caption}, ({arrivalAirportlegTo.uid})
                  </p>
                  <p>
                    20:40 18 авг. вт 14 ч 45 мин 19 авг. ср 09:25
                  </p>
                  <p>
                    {legTo.length - 1} пересадка
                  </p>
                  <p>
                    Рейс выполняет: {airlinelegTo.caption}
                  </p>
                </div>
                <div className='card-leg'>
                  <p>
                    ЛОНДОН, Лондон, Хитроу (LHR) - Москва, ШЕРЕМЕТЬЕВО (SVO)
                    {departureCitylegFrom.caption}, {departureAirportlegFrom.caption}, ({departureAirportlegFrom.uid}) - {arrivalCitylegFrom.caption}, {arrivalAirportlegFrom.caption} ({arrivalAirportlegFrom.uid})
                  </p>
                  <p>
                    18:10 19 авг. ср 23 ч 35 мин 20 авг. чт 19:45
                  </p>
                  <p>
                    1 пересадка
                  </p>
                  <p>
                    Рейс выполняет: {airlinelegFrom.caption}
                  </p>
                </div>
                <button type="button">ВЫБРАТЬ</button>
              </li>
            );
          })}
        {showMore < listFlight.length && (
          <button
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
