import { useEffect, useState } from "react";
import { db } from "../services/firebase";

const Add = () => {
  const [plantList, setPlantList] = useState([]);

  useEffect(() => {
    db.collection("plants")
      .get()
      .then((query) => {
        query.forEach((element) => {
          let plants = element.data();
          setPlantList(plants.list);
        });
      });
  });

  return (
    <div className="sidebar-content padded">
      <label for="plantList">What kind of plant is it?</label>
      <select name="plantList">
        {plantList.map((plant, idx) => (
          <option key={idx} value={plant.common_name}>
            {plant.common_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Add;
