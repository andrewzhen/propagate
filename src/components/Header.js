import purple from "./../assets/purple.png";
import blue from "./../assets/blue.png";
import orange from "./../assets/orange.png";
import yellow from "./../assets/yellow.png";
import red from "./../assets/red.png";

const Header = ({
  idToken,
  name,
  title,
  setTitle,
  activeIcon,
  icon,
  setIcon,
  backVisible,
  setSidebarView,
  setActiveToken,
}) => {
  const ICONS = { purple, blue, orange, yellow, red };

  return (
    <header>
      {backVisible && (
        <button
          onClick={() => {
            setSidebarView("garden");
            setTitle(`${name}'s Garden`);
            setIcon(activeIcon);
            setActiveToken(idToken);
          }}
        >
          Back to your garden
        </button>
      )}
      <h1>{title}</h1>
      <img src={ICONS[icon]} alt="" />
    </header>
  );
};

export default Header;
