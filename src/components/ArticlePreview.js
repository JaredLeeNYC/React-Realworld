import React from "react";
import { Link } from "@reach/router";

export default function ArticlePreview({ article }) {
  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link to="/profile">
          <img src={article.author.image} />
        </Link>

        <div className="info">
          <Link to="/profile" className="article.author">
            {article.author.username}
          </Link>
          <span className="date">{article.createdAt}</span>
        </div>
        <button className="btn btn-outline-primary btn-sm pull-xs-right">
          <i className="ion-heart"></i> {article.favoritesCount}
        </button>
      </div>
      <Link to={`/article/${article.slug}`} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
      </Link>
    </div>
  );
}
