import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { db } from "../services/firebase";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWp6aGVuIiwiYSI6ImNrbGw4OWsweTExZmEyd3Fybmh2ZGN4ZmYifQ.m7cjSwBWDtwtWetZl4ZSjg";

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-117.2234085);
  const [lat, setLat] = useState(32.8637729);
  const [coordinates, setCoordinates] = useState([lng, lat]);
  const [zoom, setZoom] = useState(16);
  const COLORS = {
    green: "#A7D2C4",
  };

  const fetchUsers = () => {
    db.collection("users")
      .get()
      .then((query) => {
        query.forEach((element) => {
          let user = element.data();

          console.log(user);

          let userCoordinates = [
            user.location.longitude,
            user.location.latitude,
          ];
          setCoordinates(userCoordinates);

          const el = document.createElement("div");
          el.className = "marker";
          el.style.backgroundColor = COLORS[user.backgroundColor];

          new mapboxgl.Marker(el).setLngLat(userCoordinates).addTo(map.current);
        });
      });
  };

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: coordinates,
      zoom: zoom,
    }).on("load", () => fetchUsers());
  });

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
      <button
        id="return"
        onClick={() =>
          map.current.flyTo({ center: coordinates, essential: true })
        }
      >
        Return Home
      </button>
    </div>
  );
};

export default Map;
