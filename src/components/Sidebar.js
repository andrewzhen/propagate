import { useEffect, useState } from 'react';
import mascot from "./../assets/1.svg";
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

const Sidebar = ({ name, plants, propagations }) => {
  const [activeTab, setActiveTab] = useState("plant");
  const [userPlants, setUserPlants] = useState([])
  const [userProps, setUserProps] = useState([])

  useEffect(() => {
    setUserPlants(plants)
  }, [plants])

  useEffect(() => {
    setUserProps(propagations)
  }, [propagations])

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
              <span>{userPlants.length}</span> Plant{userPlants.length !== 1 && "s"}
            </button>

            <button 
              className={activeTab === "propagation" ? "active" : null}
              onClick={() => setActiveTab("propagation")}
            >
              <span>{userProps.length}</span> Propagation{userProps.length !== 1 && "s"}
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
            {(activeTab === 'plant' ? userPlants : userProps).map((plant, idx) => ( 
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