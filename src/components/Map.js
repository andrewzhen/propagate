import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { db } from "../services/firebase";
import Icon from "./../assets/1.png";
import { getDocs } from "@firebase/firestore";
import Garden from "./Garden";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWp6aGVuIiwiYSI6ImNrbGw4OWsweTExZmEyd3Fybmh2ZGN4ZmYifQ.m7cjSwBWDtwtWetZl4ZSjg";

const Map = ({
  idToken,
  activeToken,
  setActiveToken,
  setTitle,
  setSidebarView,
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [coordinates, setCoordinates] = useState([0, 0]);
  const ZOOM = 0;
  const [pitch, setPitch] = useState(1);
  const COLORS = {
    green: "#A7D2C4",
    red: "#FF5A5F",
    yellow: "#E7B87D",
    blue: "#5B84EE",
  };
  const [gardenData, setGardenData] = useState([]);
  const [showReturnButton, setShowReturnButton] = useState(false);

  const getCoordinatesFromPostcode = async (postcode) => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${postcode}.json?country=us&types=postcode&language=en&access_token=${mapboxgl.accessToken}`
    );
    const data = await response.json();
    return data.features[0].geometry.coordinates;
  };

  const getGeojson = (users, gardens) => {
    let allUsers = [];
    users.forEach((element) => {
      allUsers.push(element.data());
    });

    return {
      type: "FeatureCollection",
      features: allUsers.map((user, idx) => {
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [
              user.coordinates.longitude + (Math.random() * 2 - 1) / 12,
              user.coordinates.latitude + (Math.random() * 2 - 1) / 12,
            ],
          },
          properties: {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            color: user.backgroundColor,
            garden: gardens[idx] && gardens[idx].map((x) => x["common_name"]),
          },
        };
      }),
    };
  };

  const addMapData = (id, geojson) => {
    let userLocation = geojson.features.find(
      (feature) => feature.properties.id == id
    ).geometry.coordinates;
    setCoordinates(userLocation);

    map.current.flyTo({
      center: userLocation,
      speed: 1.3,
      zoom: idToken === activeToken ? 5 : map.current.getZoom(),
      essential: true,
    });

    !map.current.hasImage(`icon-${id}`) &&
      !map.current.getLayer("user-labels") &&
      map.current.loadImage(Icon, (error, image) => {
        if (error) throw error;

        map.current.addImage(`icon-${id}`, image, { sdf: true });
        map.current.addSource("users", {
          type: "geojson",
          data: geojson,
        });

        map.current.addLayer({
          id: "user-labels",
          type: "symbol",
          source: "users",
          layout: {
            "text-field": ["get", "name"],
            "text-radial-offset": 2,
            "text-variable-anchor": ["top"],
            "icon-image": `icon-${id}`,
            "icon-size": 0.5,
            "icon-allow-overlap": true,
            "text-allow-overlap": true,
            "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
            "text-size": 11,
          },
          paint: {
            "text-color": "#307473",
            "text-halo-color": "#fff",
            "text-halo-width": 2,
            "icon-color": [
              "match",
              ["get", "color"],
              "green",
              COLORS.green,
              "red",
              COLORS.red,
              "yellow",
              COLORS.yellow,
              "blue",
              COLORS.blue,
              "#000",
            ],
          },
        });

        map.current.on("click", "user-labels", (e) => {
          let id = e.features[0].properties.id;
          if (id !== idToken) {
            setSidebarView("neighbor");
            setActiveToken(id);
            setTitle(`${e.features[0].properties.name.split(" ")[0]}'s Garden`);
            map.current.flyTo({
              center: e.features[0].geometry.coordinates,
            });
          }
        });

        map.current.on("mouseenter", "marker", () => {
          map.getCanvas().style.cursor = "pointer";
        });

        map.current.on("mouseleave", "marker", () => {
          map.getCanvas().style.cursor = "default";
        });
      });
  };

  const loadGardenData = () => {
    db.collection("users")
      .get()
      .then((users) => {
        let allGardens = [];
        users.forEach((user) => {
          user.ref
            .collection("garden")
            .get()
            .then((garden) => {
              let singleGarden = [];
              garden.forEach((plant) => {
                singleGarden.push(plant.data());
              });

              return singleGarden;
            })
            .then((singleGarden) => allGardens.push(singleGarden));
        });

        return allGardens;
      })
      .then((allGardens) => setGardenData(allGardens));
  };

  const togglePitch = () => {
    let currPitch = map.current.getPitch();
    let newPitch = currPitch === 60 ? 0 : 60;
    setPitch(newPitch);
    map.current.setPitch(newPitch);
  };

  useEffect(() => {
    if (activeToken && gardenData) {
      db.collection("users")
        .get()
        .then((query) =>
          addMapData(activeToken, getGeojson(query, gardenData))
        );
    }
  }, [activeToken, gardenData]);

  useEffect(() => {
    if (map.current || !activeToken) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: coordinates,
      ZOOM,
      pitch,
    })
      .on("load", () => loadGardenData())
      .addControl(new mapboxgl.NavigationControl(), "top-right")
      .on("movestart", () => setShowReturnButton(true));
  }, [activeToken]);

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
      <button type="button" id="pitch" onClick={() => togglePitch()}>
        {pitch === 60 ? "2D" : "3D"}
      </button>
      {showReturnButton && (
        <button
          id="return"
          onClick={() => {
            map.current.flyTo({ center: coordinates, essential: true });
            setShowReturnButton(false);
          }}
        ></button>
      )}
    </div>
  );
};

export default Map;
