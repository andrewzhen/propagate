import { signInWithGoogle } from "../services/firebase";

const Login = () => {
  return (
    <div className="login">
      <h1>propagate</h1>
      <button id="loginBtn" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </div>
  )
}

export default Login;