import React, {useEffect, useState} from 'react';
import {auth} from '../services/firebase';
import Sidebar from './Sidebar';
import Map from './Map';

const Home = ({user}) => {
  const [sidebarView, setSidebarView] = useState('garden')
  const [firstName, setFirstName] = useState('')
  const [shovelActive, setShovelActive] = useState(false)

  useEffect(() => {
    setFirstName(user.displayName.split(' ')[0])
  }, [user])

  return (
    <div onClick={() => setShovelActive(false)}>
      <Sidebar sidebarView={sidebarView} setSidebarView={setSidebarView} name={firstName} shovelActive={shovelActive} setShovelActive={setShovelActive} />

      <Map />

      <button id="logoutBtn" onClick={() => auth.signOut()}>
        Sign out
      </button>
    </div>
  )
};

export default Home;