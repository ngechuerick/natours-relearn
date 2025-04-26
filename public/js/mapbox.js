import mapboxgl from 'mapbox-gl';

/* eslint-disable */
export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoicmlja3ljb2RlcyIsImEiOiJjbHY1bDdkdWQwMnJjMmtxZnFwdGQxcnJ4In0.hNXLzBB-393cZtsiIUjr2w';

  // FIXME TO BE FIXED DURING PRODUCTION
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/rickycodes/clvbk82bo00un01qp4nbobr3a',
    scrollZoom: false,
    touchZoomRotate: true,
    // center: [-118.113491, 34.111745],
    // zoom: 10,
    // interactive: false
  });

  // Add error listeners
  map.on('load', () => console.log('Map loaded successfully!'));
  map.on('error', e => console.error('Map error:', e.error));

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    /**Create marker */
    const el = document.createElement('div');
    el.className = 'marker';

    /**Add marker */
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    /** Add popup */
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    /**Extend map bounds to include current location */
    bounds.extend(loc.coordinates);
  });

  /**This function fixs the move and zoom in animation */
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
