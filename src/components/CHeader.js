import React, { useContext } from "react";
import { Link } from "@reach/router";
import AuthContext from "../context/AuthContext";

export default function CHeader() {
  const [Auth] = useContext(AuthContext);

  const LoggedOutView = props => {
    if (!props.currentUser.username) {
      return (
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <Link className="nav-link active" to="/">
              Home {Auth.username}
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/login">
              Sign in
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/register">
              Sign up
            </Link>
          </li>
        </ul>
      );
    }
    return null;
  };

  const LoggedInView = props => {
    if (props.currentUser.username) {
      return (
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <Link className="nav-link active" to="/">
              Home
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/editor">
              <i className="ion-compose"></i>&nbsp;New Post
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/settings">
              <i className="ion-gear-a"></i>&nbsp;Settings
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to={`/profile/${Auth.username}`}>
              {Auth.username}
            </Link>
          </li>
        </ul>
      );
    }
    return null;
  };

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          conduit
        </Link>

        <LoggedOutView currentUser={Auth} />
        <LoggedInView currentUser={Auth} />
      </div>
    </nav>
  );
}
