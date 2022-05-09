import React, { useEffect, useState } from "react";
import { auth } from "../services/firebase";
import Sidebar from "./Sidebar";
import Map from "./Map";

const Home = ({ user }) => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [shovelActive, setShovelActive] = useState(false);

  useEffect(() => {
    let name = user.displayName.split(" ")[0];
    setName(name);
    setTitle(`${name}'s Garden`);
  }, [user]);

  return (
    <div onClick={() => setShovelActive(false)}>
      <Sidebar
        name={name}
        title={title}
        setTitle={setTitle}
        shovelActive={shovelActive}
        setShovelActive={setShovelActive}
      />

      <Map />

      <button id="logoutBtn" onClick={() => auth.signOut()}>
        Sign out
      </button>
    </div>
  );
};

export default Home;
