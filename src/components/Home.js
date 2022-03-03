import React, {useEffect, useState} from 'react';
import { auth, db } from '../services/firebase';
import Sidebar from './Sidebar';
import Map from './Map';

const Home = ({ user }) => {
  const [firstName, setFirstName] = useState("")
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
    setFirstName(user.displayName.split(' ')[0])
  }, [user])

  useEffect(() => {
    getPlants()
  }, [])

  return (
    <div>
      <Sidebar name={firstName} plants={plants} propagations={propagations} />

      <Map />

      <button id="logoutBtn" onClick={() => auth.signOut()}>
        Sign out
      </button>
    </div>
  )
};

export default Home;