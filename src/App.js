import React from "react";
import { Router } from "@reach/router";
import CHeader from "./components/CHeader";
import CFooter from "./components/CFooter";
import Home from "./components/Home";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import CreateAritcle from "./components/CreateArticle";
import Article from "./components/Article";

function App() {
  return (
    <div className="App">
      <CHeader />
      <Router>
        <Home path="/" />
        <Login path="/login" />
        <Profile path="/profile" />
        <Settings path="/settings" />
        <CreateAritcle path="/createArticle" />
        <Article path="/article/:id" />
      </Router>

      <CFooter />
    </div>
  );
}

export default App;
