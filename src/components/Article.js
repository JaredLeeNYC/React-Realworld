import React, { useState, useEffect, useContext } from "react";
import { Link } from "@reach/router";
import agent from "./agent";
import authContext from "../context/AuthContext";
import marked from "marked";

export default function Article({ slug }) {
  const [article, setArticle] = useState({
    author: {
      slug: "",
      title: "",
      description: "",
      body: "",
      tagList: [],
      createdAt: "",
      updatedAt: "",
      favorited: false,
      favoritesCount: 0,
      author: {
        username: "",
        bio: "",
        image: "",
        following: false
      }
    }
  });
  const [comments, setComments] = useState([]);
  const [auth, setAuth] = useContext(authContext);
  const [markup, setMarkup] = useState({ __html: "" });

  useEffect(() => {
    agent.Articles.get(slug).then(res => {
      setArticle(res.article);
      setMarkup({ __html: marked(res.article.body, { sanitize: true }) });
    });
    agent.Comments.forArticle(slug).then(res => {
      setComments(res.comments);
    });
  }, [slug]);

  const OwnArticleView = props => {
    if (props.currentUser.username === article.author.username) {
      return (
        <>
          <button className="btn btn-sm btn-outline-secondary">
            <i className="ion-edit"></i>
            &nbsp; Edit Article
          </button>
          &nbsp;
          <button className="btn btn-outline-danger btn-sm">
            <i className="ion-trash-a"></i>
            Delete Article
          </button>
        </>
      );
    }
    return (
      <>
        <button className="btn btn-sm btn-outline-secondary">
          <i className="ion-plus-round"></i>
          &nbsp; Follow {article.author.username}
        </button>
        &nbsp;
        <button className="btn btn-sm btn-outline-primary">
          <i className="ion-heart"></i>
          &nbsp; Favorite Post{" "}
          <span className="counter">{article.favoritesCount}</span>
        </button>
      </>
    );
  };

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>

          <div className="article-meta">
            <Link to="">
              <img src={article.author.image} />
            </Link>
            <div className="info">
              <Link to="" className="author">
                {article.author.username}
              </Link>
              <span className="date">{article.createdAt}</span>
            </div>
            <OwnArticleView currentUser={auth} />
          </div>
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <div dangerouslySetInnerHTML={markup}></div>
            {console.log(markup)}
          </div>
        </div>

        <hr />

        <div className="article-actions">
          <div className="article-meta">
            <Link to="profile.html">
              <img src={article.author.image} />
            </Link>
            <div className="info">
              <Link to="" className="author">
                Eric Simons
              </Link>
              <span className="date">{article.createdAt}</span>
            </div>
            <button className="btn btn-sm btn-outline-secondary">
              <i className="ion-plus-round"></i>
              &nbsp; Follow {article.author.username}
            </button>
            &nbsp;&nbsp;
            <button className="btn btn-sm btn-outline-primary">
              <i className="ion-heart"></i>
              &nbsp; Favorite Post{" "}
              <span className="counter">{article.favoritesCount}</span>
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            <form className="card comment-form">
              <div className="card-block">
                <textarea
                  className="form-control"
                  placeholder="Write a comment..."
                  rows="3"
                ></textarea>
              </div>
              <div className="card-footer">
                <img
                  src={article.author.image}
                  className="comment-author-img"
                />
                <button className="btn btn-sm btn-primary">Post Comment</button>
              </div>
            </form>

            {comments.map(comment => {
              return (
                <div className="card">
                  <div className="card-block">
                    <p className="card-text">{comment.body}</p>
                  </div>
                  <div className="card-footer">
                    <Link to="" className="comment-author">
                      <img
                        src={comment.author.image}
                        className="comment-author-img"
                      />
                    </Link>
                    &nbsp;
                    <Link to="" className="comment-author">
                      {comment.author.username}
                    </Link>
                    <span className="date-posted">{comment.createdAt}</span>
                    <span className="mod-options">
                      <i className="ion-edit"></i>
                      <i className="ion-trash-a"></i>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
