import mascot from "./../assets/1.svg";

const Header = ({
  idToken,
  name,
  title,
  setTitle,
  backVisible,
  setSidebarView,
  setActiveToken,
}) => {
  return (
    <header>
      {backVisible && (
        <button
          onClick={() => {
            setSidebarView("garden");
            setTitle(`${name}'s Garden`);
            setActiveToken(idToken);
          }}
        >
          {/* {name}'s Garden */}
          Back to your garden
        </button>
      )}
      <h1>{title}</h1>
      <img src={mascot} alt="" />
    </header>
  );
};

export default Header;
