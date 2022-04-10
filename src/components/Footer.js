import home from "./../assets/home.svg";
import search from "./../assets/search.svg";
import settings from "./../assets/settings.svg";

const TABS = [
  {
    name: "Home",
    img: home,
  },
  {
    name: "Search",
    img: search,
  },
  {
    name: "Settings",
    img: settings,
  },
];

const Footer = () => {
  return (
    <footer>
      <nav>
        <ul>
          {TABS.map((tab, idx) => (
            <li key={idx}>
              <button>
                <img src={tab.img} alt={tab.name} />
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
