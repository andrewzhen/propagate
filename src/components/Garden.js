import { useEffect, useState, useRef } from "react";
import { db } from "../services/firebase";
import copy from "../assets/copy.svg";
import check from "../assets/check.svg";
import { doc } from "@firebase/firestore";

const Garden = ({ activeToken }) => {
  const [activeTab, setActiveTab] = useState("plant");
  const [plants, setPlants] = useState([]);
  const [propagations, setPropagations] = useState([]);
  const clipboards = useRef([]);

  const getPlants = (queryId) => {
    let user = db.collection("users").doc(queryId);
    user
      .collection("garden")
      .get()
      .then((gardenDoc) => {
        let plants = [];
        let propagations = [];
        gardenDoc.forEach((plant) => {
          let plantData = plant.data();
          plantData.id = plant.id;

          plants.push(plantData);

          if (plant.data().propagation) {
            propagations.push(plantData);
          }
        });
        setPlants(plants);
        setPropagations(propagations);
      });
  };

  useEffect(() => {
    activeToken && getPlants(activeToken);
  }, [activeToken]);

  return (
    <div className="sidebar-content">
      <div className="garden-tabs">
        <button
          className={activeTab === "plant" ? "active" : null}
          onClick={() => setActiveTab("plant")}
        >
          <span>{plants.length}</span> Plant{plants.length !== 1 && "s"}
        </button>

        <button
          className={activeTab === "propagation" ? "active" : null}
          onClick={() => setActiveTab("propagation")}
        >
          <span>{propagations.length}</span> Propagation
          {propagations.length !== 1 && "s"}
        </button>

        <div className="garden-tabs__active">
          <div
            className={`indicator ${activeTab !== "plant" ? "slide" : null}`}
          ></div>
        </div>
      </div>

      <ul className="plant-list">
        {(activeTab === "plant" ? plants : propagations).map((plant, idx) => (
          <li key={idx} className="plant">
            <div className="plant-img-placeholder">
              <img src={plant["image_url"]} alt="" />
            </div>
            <div className="plant-overview">
              <h3>{plant.nickname}</h3>
              <div>
                <p className="scientific">{plant["species_name"]}</p>
                <p>{plant["common_name"]}</p>
              </div>
              <img
                ref={(el) => (clipboards.current[idx] = el)}
                className="plant-id"
                src={copy}
                onClick={() => {
                  navigator.clipboard.writeText(plant.id);
                  clipboards.current[idx].src = check;
                  setTimeout(() => {
                    try {
                      clipboards.current[idx].src = copy;
                    } catch (e) {}
                  }, 3000);
                }}
                alt="Copy Plant ID"
                title="Copy Plant ID"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Garden;
