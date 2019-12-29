import React, { useState, useEffect, useContext } from "react";
import { Link } from "@reach/router";
import agent from "./agent";
import ArticlePreview from "./ArticlePreview";
import authContext from "../context/AuthContext";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [tags, setTags] = useState([]);
  const [auth] = useContext(authContext);
  const [tabs, setTabs] = useState(["Global Feed"]);
  const [tagOnClick, setTagOnClick] = useState("Global Feed");
  const [range, setrange] = useState([]);
  const [page, setpage] = useState(0);
  const [isFresh, setIsFresh] = useState(false);

  useEffect(() => {
    agent.Tags.getAll().then(res => {
      console.log(res);
      setTags(res.tags);
    });
    return () => {};
  }, []);

  useEffect(() => {
    const newTabs = [...tabs];
    let newTagOnClick = tagOnClick;
    const newRange = range.slice(0, 0);

    if (auth.username) {
      if (newTabs.indexOf("Your Feed") === -1) {
        newTabs.splice(1, 0, "Your Feed");
        newTagOnClick = "Your Feed";
      }
    } else {
      if (newTabs.indexOf("Your Feed") !== -1) {
        newTabs.splice(1, 1);
        newTagOnClick = "Global Feed";
      }
    }

    switch (newTagOnClick) {
      case "Global Feed":
        agent.Articles.all(page).then(res => {
          setArticles(res.articles);
          for (let i = 0; i < Math.ceil(res.articlesCount / 10); ++i) {
            newRange.push(i + 1);
          }
          setrange(newRange);
        });
        break;
      case "Your Feed":
        agent.Articles.feed().then(res => {
          setArticles(res.articles);
          for (let i = 0; i < Math.ceil(res.articlesCount / 10); ++i) {
            newRange.push(i + 1);
          }
          setrange(newRange);
        });

        break;
      default:
        if (newTabs.indexOf(newTagOnClick) === -1) {
          newTabs.push(newTagOnClick);
        }
        agent.Articles.byTag(newTagOnClick, page).then(res => {
          setArticles(res.articles);
          for (let i = 0; i < Math.ceil(res.articlesCount / 10); ++i) {
            newRange.push(i + 1);
          }
          setrange(newRange);
        });
    }

    setTagOnClick(newTagOnClick);
    setTabs(newTabs);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagOnClick, page, isFresh]);

  function refresh() {
    setIsFresh(!isFresh);
  }

  const GlobalView = props => {
    return (
      <ul className="nav nav-pills outline-active">
        {props.tabs.map(byTag => {
          return (
            <li className="nav-item" key={byTag}>
              <Link
                to=""
                className={
                  props.tagOnClick === byTag ||
                  tabs.length === 1 ||
                  (tabs.length === 2 &&
                    byTag === "Your Feed" &&
                    !props.tagOnClick)
                    ? "nav-link active"
                    : "nav-link"
                }
                onClick={() => articlesByTag(byTag)}
              >
                {byTag === "Your Feed" || byTag === "Global Feed" ? "" : "#"}
                {byTag}
              </Link>
            </li>
          );
        })}
      </ul>
    );
  };

  const Pagination = props => {
    return (
      <nav>
        <ul className="pagination">
          {props.range.map(_page => {
            return (
              <li
                className={
                  page + 1 === _page ? "page-item active" : "page-item"
                }
                key={_page}
              >
                <Link
                  to=""
                  className="page-link"
                  onClick={() => changePage(_page)}
                >
                  {_page}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  };

  function articlesByTag(tag) {
    setTagOnClick(tag);
    setpage(0);
  }

  function changePage(pageOnClick) {
    setpage(pageOnClick - 1);
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
              <GlobalView tabs={tabs} tagOnClick={tagOnClick} />
            </div>

            {articles.length === 0 ? (
              <p style={{ marginTop: "70px" }}>No articles yet ...</p>
            ) : (
              articles.map(article => (
                <ArticlePreview
                  article={article}
                  key={article.slug}
                  refresh={refresh}
                />
              ))
            )}
            <Pagination range={range} />
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
              <div className="tag-list">
                <select
                  defaultValue="japan"
                  onChange={e => articlesByTag(e.target.value)}
                >
                  {tags.map((tag, index) => (
                    <option
                      className="tag-pill tag-default"
                      key={index}
                      vlaue={tag}
                    >
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
