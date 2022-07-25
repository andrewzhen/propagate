import React, { useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import Sidebar from "./Sidebar";
import Map from "./Map";

const Home = ({ user }) => {
  const [idToken, setIdToken] = useState("");
  const [activeToken, setActiveToken] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [activeIcon, setActiveIcon] = useState("");
  const [icon, setIcon] = useState("");
  const [shovelActive, setShovelActive] = useState(false);
  const [sidebarView, setSidebarView] = useState("garden");
  const [sidebarHidden, setSidebarHidden] = useState(false);

  useEffect(() => {
    let name = user.displayName.split(" ")[0];
    setName(name);
    setTitle(`${name}'s Garden`);

    db.collection("users")
      .where("token", "==", user.uid)
      .get()
      .then((querySnapshot) =>
        querySnapshot.forEach((doc) => {
          setIdToken(doc.id);
          setActiveToken(doc.id);
          setActiveIcon(doc.data().icon);
          setIcon(doc.data().icon);
        })
      );

    // console.log(user.uid);
    // user.getIdToken().then((result) => {
    //   setIdToken(result);
    // });
  }, [user]);

  return (
    <div onClick={() => setShovelActive(false)}>
      <Sidebar
        idToken={idToken}
        activeToken={activeToken}
        setActiveToken={setActiveToken}
        name={name}
        title={title}
        setTitle={setTitle}
        activeIcon={activeIcon}
        icon={icon}
        setIcon={setIcon}
        shovelActive={shovelActive}
        setShovelActive={setShovelActive}
        sidebarView={sidebarView}
        setSidebarView={setSidebarView}
        sidebarHidden={sidebarHidden}
        setSidebarHidden={setSidebarHidden}
      />

      <Map
        idToken={idToken}
        activeToken={activeToken}
        setActiveToken={setActiveToken}
        setTitle={setTitle}
        setIcon={setIcon}
        setSidebarView={setSidebarView}
        setSidebarHidden={setSidebarHidden}
      />

      <button id="logoutBtn" onClick={() => auth.signOut()}>
        Sign out
      </button>
    </div>
  );
};

export default Home;
