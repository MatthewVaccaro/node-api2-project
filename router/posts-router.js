const express = require("express");
const db = require("../data/db");

const router = express.Router();

router.get("/", (req, res) => {
  db.find()
    .then(posts => {
      if (posts) {
        return res.status(200).json(posts);
      } else {
        return res.status(404).json({ message: "No posts were found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "The posts information could not be retrieved. Sorry :/"
      });
    });
});

router.get("/:id", (req, res) => {
  db.findById(req.params.id)
    .then(posts => {
      if (posts.length > 0) {
        res.status(200).json(posts);
      } else {
        res.status(404).json({ message: "No post by that id found!" });
      }
    })
    .catch(errror => {
      res.status(500).json({
        message: "The posts information could not be retrieved. Sorry :/"
      });
    });
});

router.get("/:id/comments", (req, res) => {
  db.findPostComments(req.params.id)
    .then(comments => {
      if (comments.length > 0) {
        return res.status(200).json(comments);
      } else {
        return res
          .status(404)
          .json({ message: "There are no Comments can not be found!" });
      }
    })
    .catch(errror => {
      res.status(500).json({
        message: "The comment information could not be retrieved. Sorry :/"
      });
    });
});

router.post("/", (req, res) => {
  const submit = req.body;
  if (!submit.title || !submit.contents) {
    return res.status(404).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
    return db
      .insert(submit)
      .then(post => {
        res.status(201).json();
      })
      .catch(errror => {
        res.status(500).json({
          error: "There was an error while saving the post to the database"
        });
      });
  }
});

router.post("/:id/comments", (req, res) => {
  const newComment = { text: req.body.text, post_id: req.params.id };
  if (!newComment.text || !newComment.post_id) {
    return res
      .status(400)
      .json({ errorMessage: "Missing either text or post_id" });
  } else {
    db.insertComment(newComment)
      .then(comment => {
        res.status(201).json(comment);
      })
      .catch(error => {
        res.status(500).json({ message: "Something went wrong" });
      });
  }
});

router.delete("/:id", (req, res) => {
  db.findById(req.params.id)
    .then(deletedPost => {
      db.remove(req.params.id).then(remove => {
        return res.status(200).json(deletedPost);
      });
    })
    .catch(error => {
      res.status(500).json({ message: "Something went wrong boiiii" });
    });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const post = req.body;

  if (!post.title || !post.contents) {
    return res
      .status(400)
      .json({ message: "You're missing a title or contents" });
  } else {
    db.update(id, post)
      .then(user => {
        db.findById(id).then(user => {
          if (user) {
            return res.status(201).json(user);
          } else {
            return res.status(404).json({ message: "user not found" });
          }
        });
      })
      .catch(err => {
        res
          .status(500)
          .json({ message: "The user information could not be retrieved" });
      });
  }
});

module.exports = router;
