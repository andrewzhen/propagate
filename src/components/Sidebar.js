import { useState } from 'react';
import mascot from "./../assets/mascot.svg";
import plants from "./../plants.json";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("plant");
  const [numPlants, setNumPlants] = useState(0);
  const [numProps, setNumProps] = useState(0);

  return (
    <main>
      <div className="sidebar">
        <header>
          <h1>Andrew's Garden</h1>
          <img src={mascot} alt="" />
        </header>

        <div>
          <div className="garden-tabs">
            <button 
              className={activeTab === "plant" && "active"}
              onClick={() => setActiveTab("plant")}
            >
              <span>{numPlants}</span> Plant{numPlants !== 1 && "s"}
            </button>

            <button 
              className={activeTab === "propagation" && "active"}
              onClick={() => setActiveTab("propagation")}
            >
              <span>{numProps}</span> Propagation{numProps !== 1 && "s"}
            </button>

            <div className="garden-tabs__active">
              <div className={`indicator ${activeTab !== "plant" && "slide"}`}></div>
            </div>
          </div>

          <div className="reminders">
            <h3>Upcoming Reminders</h3>
            <ul>
              <li>Rotate <span>Monastery</span> in <span>1 day</span></li>
              <li>Replace water for <span>Boo Thang</span> in <span>4 days</span></li>
            </ul>
          </div>

          <ul className="plant-list">
            {plants.map((plant, idx) => (
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

        <footer>
          <nav>
            <ul>
              <li>tab</li>
              <li>tab</li>
              <li>tab</li>
            </ul>
          </nav>
        </footer>
      </div>
    </main>
  )
};

export default Sidebar;