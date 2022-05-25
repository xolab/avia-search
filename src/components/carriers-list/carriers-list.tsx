import {CarrierGroup} from '../../utils/utils';

type Props = {
  carriersList: CarrierGroup[],
  carriersSelected: Record<string, boolean>,
  onCheck: (name: string, checked: boolean) => void;
};

function CarriersList({carriersList, carriersSelected, onCheck}: Props) {
  return (
    <ul>
      {carriersList.map((item) => {
        const {name, enabled, minPrice} = item;

        return (
          <li key={name}>
            <label>
              <input
                type="checkbox"
                name="nameCompany"
                disabled={!enabled}
                checked={Boolean(carriersSelected[name])}
                onChange={(event) => onCheck(name, event.target.checked)}
              />
              {`- ${name} от ${minPrice} р.`}
            </label>
          </li>
        );
      })}
    </ul>
  );
}

export default CarriersList;
