import { useEffect, useState } from "react";
import { db } from "../services/firebase";

const Garden = () => {
  const [activeTab, setActiveTab] = useState("plant");
  const [plants, setPlants] = useState([]);
  const [propagations, setPropagations] = useState([]);

  const getPlants = () => {
    db.collection("users")
      .get()
      .then((query) => {
        query.forEach((element) => {
          let user = element.data();
          setPlants(user.plants);
          setPropagations(user.propagations);
        });
      });
  };

  useEffect(() => {
    getPlants();
  }, []);

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

      <div className="reminders">
        <h3>Upcoming Reminders</h3>
        <ul>
          <li>
            Rotate <span>Monastery</span> in <span>1 day</span>
          </li>
          <li>
            Replace water for <span>Boo Thang</span> in <span>4 days</span>
          </li>
        </ul>
      </div>

      <ul className="plant-list">
        {(activeTab === "plant" ? plants : propagations).map((plant, idx) => (
          <li key={idx} className="plant">
            <div className="plant-img-placeholder"></div>
            <div className="plant-overview">
              <h3>{plant.nickname}</h3>
              <div>
                <p className="scientific">{plant.scientific}</p>
                <p>{plant.name}</p>
              </div>
              <button>See More</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Garden;
