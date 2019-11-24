import React, { useState, useRef, useEffect } from "react";
import agent from "./agent";
import { navigate } from "@reach/router";

export default function Editor({ slug }) {
  const titleRef = useRef();
  const descriptionRef = useRef();
  const bodyRef = useRef();
  const tagRef = useRef();
  const [tags, setTags] = useState([]);
  const [errList, setErrList] = useState([]);

  useEffect(() => {
    if (slug) {
      agent.Articles.get(slug).then(
        res => {
          titleRef.current.value = res.article.title;
          descriptionRef.current.value = res.article.description;
          bodyRef.current.value = res.article.body;
          setTags(res.article.tagList);
        },
        e => console.log(e)
      );
    }
  }, [slug]);

  function addTag(e) {
    if (e.keyCode === 13) {
      const newTags = [...tags];
      if (!newTags.includes(tagRef.current.value)) {
        newTags.push(tagRef.current.value);
        setTags(newTags);
      }
      console.log(slug);
      tagRef.current.value = "";
    }
  }

  function publish(e) {
    e.preventDefault();
    if (slug) {
      agent.Articles.update({
        slug: slug,
        title: titleRef.current.value,
        description: descriptionRef.current.value,
        body: bodyRef.current.value,
        tagList: tags
      }).then(
        res => {
          navigate("/");
        },
        e => {
          const newErrList = [];
          for (var i in e.response.body.errors) {
            if (e.response.body.errors[i].length > 1) {
              for (var j in e.response.body.errors[i]) {
                newErrList.push(i + " " + e.response.body.errors[i][j]);
              }
            } else {
              newErrList.push(i + " " + e.response.body.errors[i]);
            }
          }
          setErrList(newErrList);
        }
      );
    } else {
      agent.Articles.create({
        title: titleRef.current.value,
        description: descriptionRef.current.value,
        body: bodyRef.current.value,
        tagList: tags
      }).then(res => {
        navigate("/");
      });
    }
  }

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <ul className="error-messages">
              {errList.map(err => {
                return <li key={err}>{err}</li>;
              })}
            </ul>
            <form>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Article Title"
                    ref={titleRef}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="What's this article about?"
                    ref={descriptionRef}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control"
                    rows="8"
                    placeholder="Write your article (in markdown)"
                    ref={bodyRef}
                  ></textarea>
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter tags"
                    ref={tagRef}
                    onKeyUp={addTag}
                  />
                  <div className="tag-list">
                    {tags.map(t => {
                      return (
                        <span className="tag-default tag-pill" key={t}>
                          <i className="ion-close-round"></i>
                          {t}
                        </span>
                      );
                    })}
                  </div>
                </fieldset>
                <button
                  className="btn btn-lg pull-xs-right btn-primary"
                  type="button"
                  onClick={publish}
                >
                  Publish Article
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
