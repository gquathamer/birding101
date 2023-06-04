import { React, useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import stateArray from '../lib/states.js';

const LocationForm = () => {
  const [state, setState] = useState('');
  const [countyArray, setCountyArray] = useState([]);
  const [county, setCounty] = useState('');

  useEffect(() => {
    if (!state) {
      return;
    }
    fetch(
      `https://api.ebird.org/v2/ref/region/list/subnational2/${state.code}`,
      {
        headers: {
          'x-ebirdapitoken': 'i6k4lfj8nhr9',
        },
      },
    )
      .then(response => response.json())
      .then(response => {
        setCountyArray(response);
      })
      .catch(err => console.error(err));
  }, [state]);

  console.log(stateArray);

  return (
    <Form>
      <Form.Group>
        <Form.Select
          onChange={e =>
            setState(stateArray.find(state => state.name === e.target.value))
          }
        >
          {!state && <option>{`Please select a state`}</option>}
          {stateArray.map((state, idx) => {
            return (
              <option value={state.name} key={idx}>
                {state.name}
              </option>
            );
          })}
        </Form.Select>
        <Form.Select
          disabled={!state}
          onChange={e =>
            setCounty(
              countyArray.find(county => county.name === e.target.value),
            )
          }
        >
          {!county && <option>{`Please select a county`}</option>}
          {countyArray.map((county, idx) => {
            return (
              <option value={county.name} key={idx}>
                {county.name}
              </option>
            );
          })}
        </Form.Select>
      </Form.Group>
    </Form>
  );
};

export default LocationForm;
