import React, { useContext, useRef, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import agent from "./agent";

export default function Settings() {
  const [Auth, setAuth] = useContext(AuthContext);
  console.log(Auth);

  const imgRef = useRef();
  const usernameRef = useRef();
  const bioRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  useEffect(() => {
    if (Auth.image) {
      imgRef.current.value = Auth.image;
    }
    if (Auth.username) {
      usernameRef.current.value = Auth.username;
    }
    if (Auth.bio) {
      bioRef.current.value = Auth.bio;
    }
    if (Auth.email) {
      emailRef.current.value = Auth.email;
    }
    if (Auth.password) {
      passwordRef.current.value = Auth.password;
    }

    return () => {};
  }, [
    Auth.bio,
    Auth.email,
    Auth.image,
    Auth.img,
    Auth.password,
    Auth.username
  ]);

  function logout() {
    setAuth({});
    agent.setToken(null);
    imgRef.current.value = null;
    usernameRef.current.value = null;
    bioRef.current.value = null;
    emailRef.current.value = null;
    passwordRef.current.value = null;
  }

  function updateUser(e) {
    e.preventDefault();

    agent.Auth.save({
      image: imgRef.current.value,
      username: usernameRef.current.value,
      bio: bioRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value
    }).then(res => {
      console.log(res);
      setAuth(res.user);
    });
  }

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings </h1>

            <form>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="URL of profile picture"
                    ref={imgRef}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Your Name"
                    ref={usernameRef}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control form-control-lg"
                    rows="8"
                    placeholder="Short bio about you"
                    ref={bioRef}
                  ></textarea>
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
                  onClick={updateUser}
                >
                  Update Settings
                </button>
              </fieldset>
            </form>
            <hr />
            <button className="btn btn-outline-danger" onClick={logout}>
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
