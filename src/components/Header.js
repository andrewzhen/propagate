import mascot from "./../assets/1.svg"

const Header = ({name}) => {
  return (
    <header>
      <h1>{name}'s Garden</h1>
      <img src={mascot} alt="" />
    </header>
  )
};

export default Header;