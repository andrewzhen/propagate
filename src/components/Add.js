import React from "react";
import { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import { db } from "../services/firebase";

const Add = ({ name, setTitle, setSidebarView }) => {
  const [plantListCommonName, setPlantListCommonName] = useState([]);
  const [propagating, setPropagating] = useState(false);
  const [commonName, setCommonName] = useState("");
  const [nickname, setNickname] = useState("");

  const addPlant = () => {
    db.collection("plants")
      .get()
      .then((query) => {
        query.forEach((plant) => {
          if (commonName === plant.data()["common_name"]) {
            const newPlant = {
              common_name: commonName,
              species_name: plant.data()["species_name"],
              nickname,
              propagation: propagating,
            };
            db.collection("users")
              .doc("KGf72XPzMaXI8o6OFpDh")
              .collection("garden")
              .add(newPlant);
          }
        });
      })
      .then(() => {
        setTitle(`${name}'s Garden`);
        setSidebarView("garden");
      });
  };

  useEffect(() => {
    db.collection("plants")
      .get()
      .then((query) => {
        let commonNames = [];
        query.forEach((documentSnapshot) => {
          commonNames.push(documentSnapshot.data()["common_name"]);
        });
        setPlantListCommonName(commonNames);
      });
  }, []);

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
            <Dropdown
              title="Select One"
              list={plantListCommonName}
              selectedItem={commonName}
              setSelectedItem={setCommonName}
            />
          </div>

          <div className="section">
            <h2>Does it have a nickname?</h2>
            <input
              type="text"
              placeholder="Nickname"
              onChange={(e) => setNickname(e.target.value)}
            ></input>
          </div>
        </>
      )}

      <button
        type="button"
        className="finish"
        onClick={() => {
          addPlant();
        }}
      >
        Finish
      </button>
    </div>
  );
};

export default Add;
