import { useState } from 'react';
import mascot from "./../assets/1.svg";
import plants from "./../plants.json";
import home from "./../assets/home.svg";
import add from "./../assets/add.svg";
import settings from "./../assets/settings.svg";

const Tabs = [
  {
    "name": "Home",
    "img": home
  },
  {
    "name": "Add",
    "img": add
  },
  {
    "name": "Settings",
    "img": settings
  }
];

const Sidebar = ({ name }) => {
  const [activeTab, setActiveTab] = useState("plant");
  const [numPlants, setNumPlants] = useState(0);
  const [numProps, setNumProps] = useState(0);

  return (
    <main>
      <div className="sidebar">
        <header>
          <h1>{name}'s Garden</h1>
          <img src={mascot} alt="" />
        </header>

        <div className="sidebar-content">
          <div className="garden-tabs">
            <button 
              className={activeTab === "plant" ? "active" : null}
              onClick={() => setActiveTab("plant")}
            >
              <span>{numPlants}</span> Plant{numPlants !== 1 && "s"}
            </button>

            <button 
              className={activeTab === "propagation" ? "active" : null}
              onClick={() => setActiveTab("propagation")}
            >
              <span>{numProps}</span> Propagation{numProps !== 1 && "s"}
            </button>

            <div className="garden-tabs__active">
              <div className={`indicator ${activeTab !== "plant" ? "slide" : null}`}></div>
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
              {Tabs.map((tab, idx) => 
                <li key={idx}>
                  <button>
                    <img src={tab.img} alt={tab.name} />
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </footer>
      </div>
    </main>
  )
};

export default Sidebar;