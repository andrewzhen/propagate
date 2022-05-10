import { useEffect, useState } from "react";
import dropdown from "./../assets/dropdown.svg";

const Dropdown = ({ title, list, selectedItem, setSelectedItem }) => {
  const [listOpen, setListOpen] = useState(false);

  const toggleList = () => setListOpen(!listOpen);
  const hideList = () => setListOpen(false);

  useEffect(() => {
    window.addEventListener("click", hideList);
    return () => window.removeEventListener("click", hideList);
  }, []);

  return (
    <div className="dd-wrapper">
      <div
        className="dd-header"
        style={{ borderRadius: listOpen ? "10px 10px 0 0" : "10px" }}
        onClick={(e) => {
          e.stopPropagation();
          toggleList();
        }}
      >
        <div className="dd-header-title">{selectedItem || title}</div>
        <img
          src={dropdown}
          alt=""
          style={{ transform: listOpen ? "rotate(180deg)" : "rotate(0)" }}
        />
      </div>

      {listOpen && (
        <div className="dd-list">
          {list.map((item, idx) => (
            <button
              key={idx}
              type="button"
              className="dd-list-item"
              onClick={() => setSelectedItem(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
