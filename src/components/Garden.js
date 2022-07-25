import { useEffect, useState, useRef } from "react";
import { db } from "../services/firebase";
import Plant from "../components/Plant";

const Garden = ({ idToken, activeToken }) => {
  const [plants, setPlants] = useState([]);
  const [propagations, setPropagations] = useState([]);
  const [activeTab, setActiveTab] = useState("plant");
  const clipboards = useRef([]);

  useEffect(() => {
    setActiveTab("plant");
  }, [plants]);

  const getPlants = (token) => {
    db.collection("users")
      .doc(token)
      .collection("garden")
      .orderBy("timestamp")
      .get()
      .then((gardenDoc) => {
        let plants = [];
        let propagations = [];
        gardenDoc.forEach((plant) => {
          let plantData = plant.data();
          plantData.id = plant.id;

          plants.push(plantData);
          plant.data().propagation && propagations.push(plantData);
        });

        return { plants, propagations };
      })
      .then((garden) => {
        setPlants(garden.plants);
        setPropagations(garden.propagations);
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
        {(activeTab === "plant" ? plants : propagations).map(
          (plant, plantIdx) => (
            <Plant
              key={plantIdx}
              plantIdx={plantIdx}
              idToken={idToken}
              activeToken={activeToken}
              getPlants={getPlants}
              plant={plant}
              clipboards={clipboards}
            />
          )
        )}
      </ul>
    </div>
  );
};

export default Garden;
