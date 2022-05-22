import {Data} from '../../types/data';

type ComponentProps = {
  filteredList: Data[],
}

function CarriersList({filteredList}: ComponentProps): JSX.Element {
  return (
    <>
      <h2>Авиакомпании ({filteredList.length} шт.)</h2>
      <ul>
        {filteredList.map((item: Data) => {
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
