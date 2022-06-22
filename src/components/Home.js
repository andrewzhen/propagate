import React, { useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import Sidebar from "./Sidebar";
import Map from "./Map";

const Home = ({ user }) => {
  const [idToken, setIdToken] = useState("");
  const [activeToken, setActiveToken] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [shovelActive, setShovelActive] = useState(false);
  const [sidebarView, setSidebarView] = useState("garden");

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
        shovelActive={shovelActive}
        setShovelActive={setShovelActive}
        sidebarView={sidebarView}
        setSidebarView={setSidebarView}
      />

      <Map
        idToken={idToken}
        activeToken={activeToken}
        setActiveToken={setActiveToken}
        setTitle={setTitle}
        setSidebarView={setSidebarView}
      />

      <button id="logoutBtn" onClick={() => auth.signOut()}>
        Sign out
      </button>
    </div>
  );
};

export default Home;
