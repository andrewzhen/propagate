import mascot from "./../assets/1.svg";

const Header = ({ name, title, setTitle, backVisible, setSidebarView }) => {
  return (
    <header>
      {backVisible && (
        <button
          onClick={() => {
            setSidebarView("garden");
            setTitle(`${name}'s Garden`);
          }}
        >
          {name}'s Garden
        </button>
      )}
      <h1>{title}</h1>
      <img src={mascot} alt="" />
    </header>
  );
};

export default Header;
