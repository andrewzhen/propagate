import { useState } from "react";
import { db } from "../services/firebase";
import copy from "../assets/copy.svg";
import check from "../assets/check.svg";
import trash from "../assets/trash.svg";

const Plant = ({
  plantIdx,
  idToken,
  activeToken,
  getPlants,
  plant,
  clipboards,
}) => {
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const removePlant = async (queryId) => {
    let plantPromise = new Promise((resolve) => {
      db.collection("users")
        .doc(idToken)
        .collection("garden")
        .get()
        .then((plants) => {
          plants.forEach((plant) => {
            if (queryId === plant.id) {
              plant.ref.delete();
              resolve("resolved");
            }
          });
        });
    });

    let clipboardPromise = new Promise((resolve) => {
      clipboards.current.forEach((clipboard) => {
        if (clipboard) {
          clipboard.src = copy;
        }
      });
      resolve("resolved");
    });

    await plantPromise;
    await clipboardPromise;
    getPlants(activeToken);
  };

  return (
    <li className="plant">
      <div className="plant-img-placeholder">
        <img src={plant["image_url"]} alt="" loading="lazy" />
      </div>
      <div className="plant-overview">
        <h3>{plant.nickname || plant["common_name"]}</h3>
        <div>
          <p className="scientific">{plant["species_name"]}</p>
          <p>{plant.nickname ? plant["common_name"] : ""}</p>
        </div>
        {activeToken === idToken && (
          <div className="actions">
            <img
              ref={(el) => (clipboards.current[plantIdx] = el)}
              className="action"
              src={copied ? check : copy}
              onClick={() => {
                navigator.clipboard.writeText(plant.id);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 3000);
              }}
              alt="Copy Plant ID"
              title="Copy Plant ID"
            />

            <img
              className="action"
              src={trash}
              onClick={() => setConfirmDelete(true)}
              alt="Delete Plant"
              title="Delete Plant"
            />
          </div>
        )}
      </div>

      {confirmDelete && (
        <div className="plant-confirm-delete">
          <h3>Are you sure you want to delete your {plant["common_name"]}?</h3>
          <div className="actions">
            <button
              className="styledBtn"
              onClick={() => removePlant(plantIdx, plant.id)}
            >
              Confirm Delete
            </button>
            <button onClick={() => setConfirmDelete(false)}>Nevermind</button>
          </div>
        </div>
      )}
    </li>
  );
};

export default Plant;
