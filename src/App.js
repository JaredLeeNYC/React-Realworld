import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";
import CHeader from "./components/CHeader";
import CFooter from "./components/CFooter";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import Editor from "./components/Editor";
import Article from "./components/Article";
import AuthContext from "./context/AuthContext";
import { LOCAL_STORAGE_TOKEN } from "./constants/localstorage";
import agent from "./components/agent";

function App() {
  const AuthHook = useState({});
  const storedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (storedToken !== "null") {
      agent.setToken(storedToken);
      agent.Auth.current().then(res => {
        AuthHook[1](res.user);
        console.log(222222222222);
        setIsLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="App">
        <AuthContext.Provider value={AuthHook}>
          <CHeader />
          "...is Loading"
          <CFooter />
        </AuthContext.Provider>
      </div>
    );
  } else {
    return (
      <div className="App">
        <AuthContext.Provider value={AuthHook}>
          <CHeader />

          <Router>
            <Home path="/" />
            <Login path="/login" />
            <Register path="/register" />
            <Profile path="/profile/:username" />
            <Settings path="/settings" />
            <Editor path="/editor" />
            <Editor path="/editor/:slug" />
            <Article path="/article/:slug" />
          </Router>

          <CFooter />
        </AuthContext.Provider>
      </div>
    );
  }
}

export default App;
