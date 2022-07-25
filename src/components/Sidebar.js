import React, { useState } from "react";
import Header from "./Header";
import Garden from "./Garden";
import Add from "./Add";

import add from "./../assets/add.svg";
import give from "./../assets/give.svg";

const Sidebar = ({
  idToken,
  activeToken,
  name,
  title,
  setTitle,
  activeIcon,
  icon,
  setIcon,
  shovelActive,
  setShovelActive,
  sidebarView,
  setSidebarView,
  setActiveToken,
  sidebarHidden,
  setSidebarHidden,
}) => {
  return (
    <main>
      <div className={`sidebar ${sidebarHidden ? "hidden" : ""}`}>
        <Header
          idToken={idToken}
          name={name}
          title={title}
          setTitle={setTitle}
          activeIcon={activeIcon}
          icon={icon}
          setIcon={setIcon}
          backVisible={sidebarView !== "garden"}
          setSidebarView={setSidebarView}
          setActiveToken={setActiveToken}
        />

        <div
          className="shovelContainer"
          style={{ display: sidebarView === "garden" ? "flex" : "none" }}
        >
          <button
            className={`shovelButton ${shovelActive ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setShovelActive(!shovelActive);
            }}
          ></button>
          <div className={`shovelActions ${shovelActive ? "visible" : ""}`}>
            <button
              id="add"
              onClick={() => {
                setSidebarView("addToGarden");
                setTitle("Add to your Garden");
              }}
            >
              <p>Add to your garden</p>
              <img src={add} alt="" />
            </button>
            {/* <hr />
            <button
              id="give"
              onClick={() => {
                setSidebarView("givePlant");
                setTitle("Give a plant");
              }}
            >
              <p>Give a plant</p>
              <img src={give} alt="" />
            </button> */}
          </div>
        </div>

        {(sidebarView === "garden" || sidebarView === "neighbor") && (
          <Garden idToken={idToken} activeToken={activeToken} />
        )}

        {sidebarView === "addToGarden" && (
          <Add
            idToken={idToken}
            name={name}
            setTitle={setTitle}
            setSidebarView={setSidebarView}
          />
        )}

        <div
          className="resizer"
          onClick={() => setSidebarHidden(sidebarHidden ? false : true)}
        ></div>
      </div>
    </main>
  );
};

export default Sidebar;
