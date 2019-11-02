import React from "react";
import { Link } from "@reach/router";

export default function CHeader() {
  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          conduit
        </Link>
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <Link className="nav-link active" to="/">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/createArticle">
              <i className="ion-compose"></i>&nbsp;New Post
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/settings">
              <i className="ion-gear-a"></i>&nbsp;Settings
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/login">
              Sign up
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
