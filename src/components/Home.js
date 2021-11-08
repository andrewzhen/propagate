import Sidebar from './Sidebar';
import Map from './Map';

import { auth } from '../services/firebase';

const Home = ({ user }) => {
  return (
    <div>
      <button id="logoutBtn" onClick={() => auth.signOut()}>
        Sign out
      </button>

      <Sidebar name={user.displayName.split(' ')[0]} />
      <Map />
    </div>
  )
};

export default Home;