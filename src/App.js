import { useEffect, useState } from "react";
import Login from "./components/Login";
import Home from "./components/Home";

import firebase from "./services/firebase";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => setUser(user));
  }, []);

  console.log(user);

  return <div id="app">{user ? <Home user={user} /> : <Login />}</div>;
};

export default App;
