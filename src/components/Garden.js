import {useEffect, useState} from 'react';
import {db} from '../services/firebase';
import add from "./../assets/add.svg"
import give from "./../assets/give.svg"
import Header from "./Header"

const Garden = ({setSidebarView, name, shovelActive, setShovelActive}) => {
  const [activeTab, setActiveTab] = useState("plant");
  const [plants, setPlants] = useState([])
  const [propagations, setPropagations] = useState([])

  const getPlants = () => {
    db.collection('users').get().then(query => {
      query.forEach(element => {
        let user = element.data()
        setPlants(user.plants)
        setPropagations(user.propagations)
      })
    })
  }

  useEffect(() => {
    getPlants()
  }, [])

  return (
    <>
      <Header name={name} />

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
            <span>{propagations.length}</span> Propagation{propagations.length !== 1 && "s"}
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
          {(activeTab === 'plant' ? plants : propagations).map((plant, idx) => ( 
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
        
        <div className="shovelContainer">
          <button className={`shovelButton ${shovelActive ? 'active' : ''}`} onClick={e => {e.stopPropagation(); setShovelActive(!shovelActive);}}></button>
          <div className={`shovelActions ${shovelActive ? 'visible' : ''}`}>
            <button id="add" onClick={() => setSidebarView('addToGarden')}>
              <p>Add to your garden</p>
              <img src={add} alt="" />
            </button>
            <hr />
            <button id="give" onClick={() => setSidebarView('givePlant')}>
              <p>Give a plant</p>
              <img src={give} alt="" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
};

export default Garden;