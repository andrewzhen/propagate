import React from "react";
import { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import { serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";

const Add = ({ idToken, name, setTitle, setSidebarView }) => {
  const [plantListCommonName, setPlantListCommonName] = useState([]);
  const [propagating, setPropagating] = useState(false);
  const [propagationCode, setPropagationCode] = useState("");
  const [commonName, setCommonName] = useState("");
  const [nickname, setNickname] = useState("");
  const [errorState, setErrorState] = useState(false);

  const addPlant = (plantData, propagating) => {
    const newPlant = {
      common_name: plantData["common_name"],
      species_name: plantData["species_name"],
      nickname: propagating
        ? nickname || plantData?.nickname
        : plantData?.nickname || nickname,
      propagation: propagating,
      image_url: plantData["image_url"],
      timestamp: serverTimestamp(),
    };

    db.collection("users").doc(idToken).collection("garden").add(newPlant);
  };

  const finishAddingPlant = async () => {
    let promise = new Promise((resolve) => {
      if (propagating) {
        db.collection("users")
          .get()
          .then((users) => {
            users.docs.forEach((user, userIdx) => {
              user.ref
                .collection("garden")
                .get()
                .then((plants) => {
                  plants.docs.forEach((plant, plantIdx) => {
                    if (propagationCode === plant.id) {
                      addPlant(plant.data(), propagating);
                      resolve("resolved");
                    } else {
                      if (
                        plantIdx === plants.size - 1 &&
                        userIdx === users.size - 1
                      ) {
                        resolve("rejected");
                      }
                    }
                  });
                });
            });
          });
      } else {
        db.collection("plants")
          .get()
          .then((query) => {
            query.forEach((plant) => {
              if (commonName === plant.data()["common_name"]) {
                addPlant(plant.data(), propagating);
                resolve("resolved");
              }
            });
          });
      }
    });

    let result = await promise;
    if (result === "rejected") {
      setErrorState(true);
    } else {
      setTitle(`${name}'s Garden`);
      setSidebarView("garden");
    }
  };

  useEffect(() => {
    setCommonName("");
  }, [propagating]);

  useEffect(() => {
    setErrorState(false);
  }, [propagationCode]);

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
            className={`styledBtn ${propagating ? "selected" : ""}`}
            onClick={() => setPropagating(true)}
          >
            Yes
          </button>
          <button
            type="button"
            className={`styledBtn ${!propagating ? "selected" : ""}`}
            onClick={() => setPropagating(false)}
          >
            No
          </button>
        </div>
      </div>

      {propagating && (
        <div className={`section ${errorState ? "errorState" : ""}`}>
          <h2>Enter the code of the propagation you're receiving.</h2>
          <input
            type="text"
            placeholder="Code"
            onChange={(e) => setPropagationCode(e.target.value)}
            spellCheck="false"
          ></input>
          <p id="codeErrorMsg">
            Oops! Couldn't find this propagation. Try another code.
          </p>
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
        </>
      )}

      <div className="section">
        <h2>
          Give your {commonName ? commonName : "plant"} a nickname (optional)
        </h2>
        <input
          type="text"
          placeholder="Nickname"
          onChange={(e) => setNickname(e.target.value)}
          spellCheck="false"
        ></input>
      </div>

      <button
        type="button"
        className={`styledBtn finish ${
          commonName || propagationCode.length >= 20 ? "" : "disabled"
        }`}
        onClick={finishAddingPlant}
      >
        Finish
      </button>
    </div>
  );
};

export default Add;
