import React, { useRef, useContext } from "react";
import AuthContext from "../context/AuthContext";
import agent from "./agent";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [auth, setAuth] = useContext(AuthContext);

  function printEmail() {
    agent.Auth.login(emailRef.current.value, passwordRef.current.value).then(
      res => {
        setAuth(res.user);
        agent.setToken(res.user.token);
      }
    );
  }

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign in</h1>
            <p className="text-xs-center">
              <a href="">Need an account?</a>
            </p>

            <ul className="error-messages">
              <li>That email is already taken</li>
              <li>{auth.email}</li>
              <li>{auth.password}</li>
            </ul>

            <form>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                  ref={emailRef}
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  ref={passwordRef}
                />
              </fieldset>
            </form>
            <button
              className="btn btn-lg btn-primary pull-xs-right"
              onClick={printEmail}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
