import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { db } from "../services/firebase";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWp6aGVuIiwiYSI6ImNrbGw4OWsweTExZmEyd3Fybmh2ZGN4ZmYifQ.m7cjSwBWDtwtWetZl4ZSjg";

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [coordinates, setCoordinates] = useState([0, 0]);
  const ZOOM = 0;
  const [pitch, setPitch] = useState(1);
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
          map.current.flyTo({
            center: userCoordinates,
            speed: 1.3,
            zoom: 16,
            essential: true,
          });

          const el = document.createElement("div");
          el.className = "marker";
          el.style.backgroundColor = COLORS[user.backgroundColor];

          new mapboxgl.Marker(el).setLngLat(userCoordinates).addTo(map.current);
        });
      });
  };

  const togglePitch = () => {
    let currPitch = map.current.getPitch();
    let newPitch = currPitch === 60 ? 0 : 60;
    setPitch(newPitch);
    map.current.setPitch(newPitch);
  };

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: coordinates,
      ZOOM,
      pitch,
    })
      .on("load", () => fetchUsers())
      .addControl(new mapboxgl.NavigationControl(), "top-right");
  });

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
      <button type="button" id="pitch" onClick={() => togglePitch()}>
        {pitch === 60 ? "2D" : "3D"}
      </button>
      <button
        id="return"
        onClick={() =>
          map.current.flyTo({ center: coordinates, essential: true })
        }
      ></button>
    </div>
  );
};

export default Map;
