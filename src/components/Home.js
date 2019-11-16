import React, { useState, useEffect } from "react";
import { Link } from "@reach/router";
import agent from "./agent";
import ArticlePreview from "./ArticlePreview";

export default function Home() {
  const [articles, setarticles] = useState([]);
  const [tags, settags] = useState([]);

  useEffect(() => {
    agent.Articles.all().then(res => {
      // console.log(res.articles);
      setarticles(res.articles);
    });
    return () => {};
  }, []);

  useEffect(() => {
    agent.Tags.getAll().then(res => {
      console.log(res.tags);
      settags(res.tags);
    });
    return () => {};
  }, []);

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
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <Link className="nav-link disabled" to="/">
                    Your Feed
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" to="/">
                    Global Feed
                  </Link>
                </li>
              </ul>
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
                  <Link to="/" className="tag-pill tag-default" key={index}>
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
