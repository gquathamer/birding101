import { React } from 'react';
import { MapContainer, useMap, TileLayer, Marker, Popup } from 'react-leaflet';
import { PropTypes } from 'prop-types';
import L from 'leaflet';

function MapHook({ bounds }) {
  const map = useMap();
  map.fitBounds(bounds);
}

export default function Map({ observations }) {
  let bounds;
  observations.length > 0
    ? (bounds = L.latLngBounds(
        observations.map(coord => [coord.lat, coord.lng]),
      ))
    : (bounds = L.latLngBounds([
        [39.37, -105.642],
        [40.014, -104.664],
      ]));

  return (
    <>
      <MapContainer zoom={8} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapHook bounds={bounds}></MapHook>
        {observations.length &&
          observations.map((obs, idx) => {
            return (
              <Marker key={idx} position={[obs.lat, obs.lng]}>
                <Popup>
                  {`${obs.howMany} ${obs.comName} spotted at ${obs.locName}`}
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </>
  );
}

Map.propTypes = {
  observations: PropTypes.array,
};
