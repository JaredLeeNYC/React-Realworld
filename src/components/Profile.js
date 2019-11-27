import React, { useState, useContext, useEffect } from "react";
import Authcontext from "../context/AuthContext";
import agent from "./agent";
import { Link } from "@reach/router";

export default function Profile({ username }) {
  const [profile, setProfile] = useState({
    username: "",
    bio: "",
    image: "",
    following: false
  });
  const [auth, setAuth] = useContext(Authcontext);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    agent.Profile.get(username).then(
      res => {
        console.log(username);
        setProfile(res.profile);
      },
      e => console.log(e.response)
    );
    agent.Articles.byAuthor(username).then(res => {
      setArticles(res.articles);
    });
  }, [username]);

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img src={profile.image} className="user-img" />
              <h4>{profile.username}</h4>
              <p>{profile.bio}</p>
              <button className="btn btn-sm btn-outline-secondary action-btn">
                <i className="ion-plus-round"></i>
                &nbsp; Follow {profile.username}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <a className="nav-link active" href="">
                    My Articles
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="">
                    Favorited Articles
                  </a>
                </li>
              </ul>
            </div>

            {articles.map(article => {
              return (
                <div className="article-preview" key={article.slug}>
                  <div className="article-meta">
                    <Link to="">
                      <img src={article.author.image} />
                    </Link>
                    <div className="info">
                      <a href="" className="author">
                        {article.author.username}
                      </a>
                      <span className="date">{article.createdAt}</span>
                    </div>
                    <button className="btn btn-outline-primary btn-sm pull-xs-right">
                      <i className="ion-heart"></i> {article.favoritesCount}
                    </button>
                  </div>
                  <Link to="" className="preview-link">
                    <h1>{article.title}</h1>
                    <p>{article.description}</p>
                    <span>Read more...</span>
                    <ul className="tag-list">
                      {article.tagList.map(tag => {
                        return (
                          <li
                            className="tag-default tag-pill tag-outline"
                            key={tag}
                          >
                            {tag}
                          </li>
                        );
                      })}
                    </ul>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
