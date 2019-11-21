import React, { useState, useEffect, useContext } from "react";
import { Link } from "@reach/router";
import agent from "./agent";
import ArticlePreview from "./ArticlePreview";
import authContext from "../context/AuthContext";

export default function Home() {
  const [articles, setarticles] = useState([]);
  const [tags, settags] = useState([]);
  const [auth] = useContext(authContext);
  const [byTags, setbyTags] = useState(["Global Feed"]);
  const [tagOnClick, setTagOnClick] = useState("");
  const [range, setrange] = useState([]);
  const [page, setpage] = useState(0);

  useEffect(() => {
    const newRange = range.slice(0, 0);

    if (tagOnClick === "Global Feed") {
      agent.Articles.all().then(res => {
        setarticles(res.articles);
        for (let i = 0; i < Math.ceil(res.articlesCount / 10); ++i) {
          newRange.push(i + 1);
        }
        setrange(newRange);
      });
    } else if (tagOnClick === "Your Feed") {
      agent.Articles.feed().then(res => {
        setarticles(res.articles);
        for (let i = 0; i < Math.ceil(res.articlesCount / 10); ++i) {
          newRange.push(i + 1);
        }
        setrange(newRange);
      });
    } else if (tagOnClick === "") {
      return;
    } else {
      agent.Articles.byTag(tagOnClick, 1).then(res => {
        let newByTags = [...byTags];
        console.log(newByTags);
        setarticles(res.articles);
        if (byTags.indexOf(tagOnClick) === -1) {
          setbyTags([...newByTags, tagOnClick]);
        }
        for (let i = 0; i < Math.ceil(res.articlesCount / 10); ++i) {
          newRange.push(i + 1);
        }
        setrange(newRange);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagOnClick]);

  useEffect(() => {
    if (auth.username) {
      setbyTags(["Your Feed", "Global Feed"]);
      agent.Articles.feed().then(res => {
        setarticles(res.articles);
        if (range.length === 0) {
          for (let i = 0; i < Math.ceil(res.articlesCount / 10); ++i) {
            range.push(i + 1);
          }
          setrange(range);
        }
      });
    } else {
      agent.Articles.all(page).then(res => {
        setarticles(res.articles);
        if (range.length === 0) {
          for (let i = 0; i < Math.ceil(res.articlesCount / 10); ++i) {
            range.push(i + 1);
          }
          setrange(range);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // useEffect(() => {
  //   if (auth.username) {
  //     setbyTags(["Your Feed", "Global Feed"]);
  //     agent.Articles.feed().then(res => {
  //       setarticles(res.articles);
  //       if (range.length === 0) {
  //         for (let i = 0; i < Math.ceil(res.articlesCount / 10); ++i) {
  //           range.push(i + 1);
  //         }
  //         setrange(range);
  //       }
  //     });
  //   } else {
  //     agent.Articles.all(page).then(res => {
  //       setarticles(res.articles);
  //       if (range.length === 0) {
  //         for (let i = 0; i < Math.ceil(res.articlesCount / 10); ++i) {
  //           range.push(i + 1);
  //         }
  //         setrange(range);
  //       }
  //     });
  //   }

  //   return () => {};
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [auth.username, page]);

  useEffect(() => {
    agent.Tags.getAll().then(res => {
      settags(res.tags);
    });
    return () => {};
  }, []);

  const GlobalView = props => {
    return (
      <ul className="nav nav-pills outline-active">
        {props.byTags.map(byTag => {
          return (
            <li className="nav-item" key={byTag}>
              <Link
                to=""
                className={
                  props.tagOnClick === byTag ||
                  byTags.length === 1 ||
                  (byTags.length === 2 &&
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

    // if (tag === "Global Feed") {
    //   agent.Articles.all().then(res => {
    //     setrange([]);
    //     setarticles(res.articles);
    //     for (let i = 0; i < Math.ceil(res.articlesCount / 10); ++i) {
    //       range.push(i + 1);
    //     }
    //     setrange(range);
    //   });
    // } else if (tag === "Your Feed") {
    //   agent.Articles.feed().then(res => {
    //     setrange([]);
    //     setarticles(res.articles);
    //     for (let i = 0; i < Math.ceil(res.articlesCount / 10); ++i) {
    //       range.push(i + 1);
    //     }
    //     setrange(range);
    //   });
    // } else {
    //   agent.Articles.byTag(tag, 1).then(res => {
    //     let newByTags = [...byTags];
    //     setrange([]);
    //     setarticles(res.articles);
    //     if (byTags.indexOf(tag) === -1) {
    //       setbyTags([...newByTags, tag]);
    //     }
    //     for (let i = 0; i < Math.ceil(res.articlesCount / 10); ++i) {
    //       range.push(i + 1);
    //     }
    //     console.log(range);
    //     setrange(range);
    //   });
    // }
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
              <GlobalView byTags={byTags} tagOnClick={tagOnClick} />
            </div>

            {articles.map(article => (
              <ArticlePreview article={article} key={article.slug} />
            ))}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
