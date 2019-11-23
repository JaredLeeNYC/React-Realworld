import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";
import CHeader from "./components/CHeader";
import CFooter from "./components/CFooter";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import CreateAritcle from "./components/CreateArticle";
import Article from "./components/Article";
import AuthContext from "./context/AuthContext";
import { LOCAL_STORAGE_TOKEN } from "./constants/localstorage";
import agent from "./components/agent";

function App() {
  const AuthHook = useState({});
  const storedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN);

  useEffect(() => {
    if (storedToken) {
      agent.setToken(storedToken);
      agent.Auth.current().then(res => {
        AuthHook[1](res.user);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <AuthContext.Provider value={AuthHook}>
        <CHeader />
        <Router>
          <Home path="/" />
          <Login path="/login" />
          <Register path="/register" />
          <Profile path="/profile" />
          <Settings path="/settings" />
          <CreateAritcle path="/createArticle" />
          <Article path="/article/:id" />
        </Router>

        <CFooter />
      </AuthContext.Provider>
    </div>
  );
}

export default App;
