import React, { useState, useEffect, useContext } from "react";
import { Link } from "@reach/router";
import agent from "./agent";
import ArticlePreview from "./ArticlePreview";
import authContext from "../context/AuthContext";

export default function Home() {
  const [articles, setarticles] = useState([]);
  const [tags, settags] = useState([]);
  let [isGlobal, setisGlobal] = useState(false);
  const [auth] = useContext(authContext);
  const [byTags, setbyTags] = useState(["Global Feed"]);
  const [tagOnClick, setTagOnClick] = useState("");

  useEffect(() => {
    agent.Articles.all().then(res => {
      // console.log(res.articles);
      if (auth.username) {
        setbyTags(["Your Feed", "Global Feed"]);
        agent.Articles.feed().then(res => {
          setarticles(res.articles);
        });
      }
      setarticles(res.articles);
    });
    return () => {};
  }, [auth.username]);

  useEffect(() => {
    agent.Tags.getAll().then(res => {
      settags(res.tags);
    });
    return () => {};
  }, []);

  const GlobalView = props => {
    if (!auth.username) {
      return (
        <ul className="nav nav-pills outline-active">
          {/* <li className="nav-item">
            <Link
              to=""
              className={
                props.byTags.length === 0 ? "nav-link active" : "nav-link"
              }
              onClick={youOrGlobal}
            >
              Global Feed
            </Link>
          </li> */}
          {props.byTags.map(byTag => {
            return (
              <li className="nav-item" key={byTag}>
                <Link
                  to=""
                  className={
                    props.tagOnClick === byTag ? "nav-link active" : "nav-link"
                  }
                  onClick={() => articlesByTag(byTag)}
                >
                  #{byTag}
                </Link>
              </li>
            );
          })}
        </ul>
      );
    }
    return (
      <ul className="nav nav-pills outline-active">
        {/* <li className="nav-item">
          <Link
            to=""
            className={
              props.isGlobal && !props.byTags ? "nav-link" : "nav-link active"
            }
            onClick={youOrGlobal}
          >
            Your Feed
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to=""
            className={
              props.isGlobal && !props.byTags ? "nav-link active" : "nav-link"
            }
            onClick={youOrGlobal}
          >
            Global Feed
          </Link>
        </li> */}
        {props.byTags.map(byTag => {
          return (
            <li className="nav-item" key={byTag}>
              <Link
                to=""
                className={
                  props.tagOnClick === byTag ? "nav-link active" : "nav-link"
                }
                onClick={() => articlesByTag(byTag)}
              >
                #{byTag}
              </Link>
            </li>
          );
        })}
      </ul>
    );
  };

  // function youOrGlobal() {
  //   if (isGlobal) {
  //     agent.Articles.feed().then(res => {
  //       setarticles(res.articles);
  //       setbyTags([]);
  //     });
  //   } else {
  //     agent.Articles.all().then(res => {
  //       setarticles(res.articles);
  //       setbyTags([]);
  //     });
  //   }
  //   setisGlobal(!isGlobal);
  // }

  function articlesByTag(tag) {
    setTagOnClick(tag);
    if (tag === "Global Feed") {
      agent.Articles.all().then(res => {
        setarticles(res.articles);
      });
    } else if (tag === "Your Feed") {
      agent.Articles.feed().then(res => {
        setarticles(res.articles);
      });
    } else {
      agent.Articles.byTag(tag, 1).then(res => {
        let newByTags = [...byTags];
        setarticles(res.articles);
        if (byTags.indexOf(tag) === -1) {
          console.log([...newByTags, tag]);
          setbyTags([...newByTags, tag]);
        }
      });
    }
  }

  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <div className="feed-toggle">
              <GlobalView
                isGlobal={isGlobal}
                byTags={byTags}
                tagOnClick={tagOnClick}
              />
            </div>

            {articles.map(article => (
              <ArticlePreview article={article} key={article.slug} />
            ))}
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>

              <div className="tag-list">
                {tags.map((tag, index) => (
                  <Link
                    to=""
                    className="tag-pill tag-default"
                    key={index}
                    onClick={() => articlesByTag(tag)}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
