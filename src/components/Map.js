import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { db } from "../services/firebase";
import purple from "./../assets/purple.png";
import blue from "./../assets/blue.png";
import orange from "./../assets/orange.png";
import yellow from "./../assets/yellow.png";
import red from "./../assets/red.png";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWp6aGVuIiwiYSI6ImNrbGw4OWsweTExZmEyd3Fybmh2ZGN4ZmYifQ.m7cjSwBWDtwtWetZl4ZSjg";

const Map = ({
  idToken,
  activeToken,
  setActiveToken,
  setTitle,
  setIcon,
  setSidebarView,
  setSidebarHidden,
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [coordinates, setCoordinates] = useState([0, 0]);
  const ZOOM = 0;
  const [pitch, setPitch] = useState(1);
  const [showReturnButton, setShowReturnButton] = useState(false);

  const getCoordinatesFromPostcode = async (postcode) => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${postcode}.json?country=us&types=postcode&language=en&access_token=${mapboxgl.accessToken}`
    );
    const data = await response.json();
    return data.features[0].geometry.coordinates;
  };

  const drawLines = (geojson) => {
    let lineCoordinates = geojson.features.map(
      (feature) => feature.geometry.coordinates
    );
    // console.log(lineCoordinates);
    map.current.addSource("route", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          // coordinates: [
          // [-122.269963, 37.868671],
          // [-118.446021, 34.1997],
          // [-117.218288, 32.867572],
          // ],
          coordinates: lineCoordinates,
        },
      },
    });

    map.current.addLayer({
      id: "route",
      type: "line",
      source: "route",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#aaa",
        "line-width": 4,
      },
    });
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
            icon: user.icon,
            backgroundColor: user.backgroundColor,
            garden: gardens[idx] && gardens[idx].map((x) => x["common_name"]),
          },
        };
      }),
    };
  };

  const addMapData = (id, geojson) => {
    let userLocation = geojson.features.find(
      (feature) => feature.properties.id === id
    ).geometry.coordinates;
    setCoordinates(userLocation);

    map.current.flyTo({
      center: userLocation,
      speed: 1.3,
      zoom: idToken === activeToken ? 5 : map.current.getZoom(),
      essential: true,
    });

    let userSource = "users";
    !map.current.getSource(userSource) &&
      map.current.addSource(userSource, {
        type: "geojson",
        data: geojson,
      });

    const ICONS = { purple, blue, orange, yellow, red };
    const COLORS = ["#A7D2C4", "#FF5A5F", "#E7B87D", "#5B84EE"];

    geojson.features.forEach((feature, idx) => {
      let icon = feature.properties.icon;
      let layerIcon = `icon-${idx + 1}`;
      let layerBG = `bg-${idx + 1}`;

      map.current.addLayer({
        id: layerBG,
        type: "circle",
        source: userSource,
        filter: ["==", "id", feature.properties.id],
        paint: {
          "circle-color": [
            "match",
            ["get", "backgroundColor"],
            1,
            COLORS[0],
            2,
            COLORS[1],
            3,
            COLORS[2],
            4,
            COLORS[3],
            "#fff",
          ],
          "circle-opacity": 0.75,
          "circle-radius": 40,
        },
      });

      map.current.loadImage(ICONS[icon], (error, image) => {
        if (error) throw error;
        else !map.current.hasImage(icon) && map.current.addImage(icon, image);

        map.current.addLayer({
          id: layerIcon,
          type: "symbol",
          source: userSource,
          filter: ["==", "id", feature.properties.id],
          layout: {
            "text-field": ["get", "name"],
            "text-radial-offset": 3,
            "text-variable-anchor": ["top"],
            "icon-image": icon,
            "icon-rotate": 180,
            "icon-size": 0.03,
            "icon-allow-overlap": true,
            "text-allow-overlap": true,
            "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
            "text-size": 14,
          },
          paint: {
            "text-color": "#307473",
            "text-halo-color": "#fff",
            "text-halo-width": 2,
          },
        });
      });

      // drawLines(geojson);

      map.current.on("click", layerIcon, (e) => {
        let id = e.features[0].properties.id;
        if (id !== idToken) {
          setSidebarView("neighbor");
          setActiveToken(id);
          setTitle(`${e.features[0].properties.name.split(" ")[0]}'s Garden`);
          setIcon(e.features[0].properties.icon);
          setSidebarHidden(false);
          map.current.flyTo({
            center: e.features[0].geometry.coordinates,
          });
        }
      });

      map.current.on("mouseenter", layerIcon, () => {
        map.current.getCanvas().style.cursor = "pointer";
      });

      map.current.on("mouseleave", layerIcon, () => {
        map.current.getCanvas().style.cursor = "default";
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
      .then((gardenData) => {
        db.collection("users")
          .get()
          .then((query) =>
            addMapData(activeToken, getGeojson(query, gardenData))
          );
      });
  };

  const togglePitch = () => {
    let currPitch = map.current.getPitch();
    let newPitch = currPitch === 60 ? 0 : 60;
    setPitch(newPitch);
    map.current.setPitch(newPitch);
  };

  useEffect(() => {
    if (map.current || !activeToken) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: coordinates,
      ZOOM,
      pitch,
    })
      .on("load", () => {
        loadGardenData();
        map.current.getCanvas().style.cursor = "default";
      })
      .addControl(new mapboxgl.NavigationControl(), "top-right")
      .on("movestart", () => setShowReturnButton(true));
  }, [activeToken, coordinates, pitch]);

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
