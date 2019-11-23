import React, { useRef, useContext, useState } from "react";
import agent from "./agent";
import AuthContext from "../context/AuthContext";
import { LOCAL_STORAGE_TOKEN } from "../constants/localstorage";

export default function Register() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [auth, setAuth] = useContext(AuthContext);

  const [errList, setErrList] = useState([]);

  function signUp(e) {
    e.preventDefault();
    agent.Auth.register(
      nameRef.current.value,
      emailRef.current.value,
      passwordRef.current.value
    ).then(
      res => {
        setAuth(res.user);
        agent.setToken(res.user.token);
        localStorage.setItem(LOCAL_STORAGE_TOKEN, res.user.token);
      },
      e => {
        const newErrList = [];
        for (var i in e.response.body.errors) {
          if (e.response.body.errors[i].length > 1) {
            for (var j in e.response.body.errors[i]) {
              newErrList.push(i + " " + e.response.body.errors[i][j]);
            }
          } else {
            newErrList.push(i + " " + e.response.body.errors[i]);
          }
        }
        setErrList(newErrList);
      }
    );
  }

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign up</h1>
            <p className="text-xs-center">
              <a href="">Have an account?</a>
            </p>

            <ul className="error-messages">
              {errList.map((err, index) => {
                return <li key={index}>{err}</li>;
              })}
            </ul>

            <form>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  ref={nameRef}
                />
              </fieldset>
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
              <button
                className="btn btn-lg btn-primary pull-xs-right"
                onClick={signUp}
              >
                Sign up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
