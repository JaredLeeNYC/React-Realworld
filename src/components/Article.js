import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, navigate } from "@reach/router";
import agent from "./agent";
import authContext from "../context/AuthContext";
import marked from "marked";

export default function Article({ slug }) {
  const [article, setArticle] = useState({
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
  });
  const [comments, setComments] = useState([]);
  const [auth] = useContext(authContext);
  const [markup, setMarkup] = useState({ __html: "" });
  const commentRef = useRef();

  useEffect(() => {
    agent.Articles.get(slug).then(res => {
      setArticle(res.article);
      setMarkup({ __html: marked(res.article.body, { sanitize: true }) });
    });
    agent.Comments.forArticle(slug).then(res => {
      setComments(res.comments);
    });
  }, [slug]);

  function postComment(e) {
    e.preventDefault();
    agent.Comments.create(slug, { body: commentRef.current.value }).then(
      res => {
        setComments([res.comment, ...comments]);
      }
    );
    commentRef.current.value = null;
  }

  const FollowButton = () => {
    if (article.author.following) {
      return (
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => {
            agent.Profile.unfollow(article.author.username).then(() => {
              setArticle({
                ...article,
                author: {
                  ...article.author,
                  following: false
                }
              });
            });
          }}
        >
          <i className="ion-plus-round"></i>
          &nbsp; unFollow {article.author.username}
        </button>
      );
    } else {
      return (
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => {
            agent.Profile.follow(article.author.username).then(() => {
              setArticle({
                ...article,
                author: {
                  ...article.author,
                  following: true
                }
              });
            });
          }}
        >
          <i className="ion-plus-round"></i>
          &nbsp; Follow {article.author.username}
        </button>
      );
    }
  };

  const OwnArticleView = props => {
    if (props.currentUser.username === article.author.username) {
      return (
        <>
          <Link to={`/editor/${article.slug}`}>
            <button className="btn btn-sm btn-outline-secondary">
              <i className="ion-edit"></i>
              &nbsp; Edit Article
            </button>
          </Link>
          &nbsp;
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => {
              agent.Articles.del(article.slug);
              navigate("/");
            }}
          >
            <i className="ion-trash-a"></i>
            Delete Article
          </button>
        </>
      );
    }

    return (
      <>
        <FollowButton />
        &nbsp;
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => {
            agent.Articles.favorite(article.slug).then(res => {
              setArticle({
                ...article,
                favoritesCount: ++article.favoritesCount
              });
            });
          }}
        >
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
            <ul className="tag-list">
              {article.tagList.map(tag => {
                return (
                  <li>
                    <Link
                      to="/"
                      className="router-link-active tag-default tag-pill tag-outline"
                      key={tag}
                    >
                      {tag}
                    </Link>
                  </li>
                );
              })}
            </ul>
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
                {article.author.username}
              </Link>
              <span className="date">{article.createdAt}</span>
            </div>
            <FollowButton />
            &nbsp;&nbsp;
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => {
                agent.Articles.favorite(article.slug).then(res => {
                  setArticle({
                    ...article,
                    favoritesCount: ++article.favoritesCount
                  });
                });
              }}
            >
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
                  ref={commentRef}
                ></textarea>
              </div>
              <div className="card-footer">
                <img
                  src={article.author.image}
                  className="comment-author-img"
                />
                <button
                  className="btn btn-sm btn-primary"
                  onClick={postComment}
                >
                  Post Comment
                </button>
              </div>
            </form>

            {comments.map(comment => {
              return (
                <div className="card" key={comment.body}>
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
                      <i
                        className={
                          comment.author.username === auth.username
                            ? "ion-trash-a"
                            : null
                        }
                        onClick={() => {
                          agent.Comments.delete(slug, comment.id).then(
                            res => {
                              const newComments = [...comments];
                              newComments.shift();
                              setComments(newComments);
                            },
                            e => {
                              console.log(e.response.text);
                            }
                          );
                        }}
                      ></i>
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
