import React from "react";
import { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import { db } from "../services/firebase";
import { limit } from "@firebase/firestore";

const Add = ({ name, setTitle, setSidebarView }) => {
  // const [plantList, setPlantList] = useState({});
  const [plantListCommonName, setPlantListCommonName] = useState([]);
  const [propagating, setPropagating] = useState(true);

  useEffect(() => {
    db.collection("plants")
      .get()
      .then((query) => {
        query.forEach((element) => {
          let plants = element.data();
          // setPlantList(plants.list);
          setPlantListCommonName(plants.list.map((plant) => plant.common_name));
        });
      });
  });

  return (
    <div className="sidebar-content padded">
      <div className="section">
        <h2>Did someone propagate this plant to you?</h2>
        <div className="button-container">
          <button
            type="button"
            className={propagating ? "selected" : ""}
            onClick={() => setPropagating(true)}
          >
            Yes
          </button>
          <button
            type="button"
            className={!propagating ? "selected" : ""}
            onClick={() => setPropagating(false)}
          >
            No
          </button>
        </div>
      </div>

      {propagating && (
        <div className="section">
          <h2>Enter the code of the propagation you're receiving.</h2>
          <input type="text" placeholder="Code"></input>
        </div>
      )}

      {!propagating && (
        <>
          <div className="section">
            <h2>What kind of plant is it?</h2>
            <Dropdown title="Select One" list={plantListCommonName} />
          </div>

          <div className="section">
            <h2>Does it have a nickname?</h2>
            <input type="text" placeholder="Nickname"></input>
          </div>
        </>
      )}

      <button
        type="button"
        className="finish"
        onClick={() => {
          setTitle(`${name}'s Garden`);
          setSidebarView("garden");
        }}
      >
        Finish
      </button>
    </div>
  );
};

export default Add;
