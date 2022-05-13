const express = require("express");
const router = express.Router();
const controller = require("../controllers/comments.controllers");
const { verify } = require("../middlewares/auth");
const validator = require("../middlewares/validator");
const commentScema = require("../middlewares/schema/comment.scema")

router.post("/",
    verify,
    validator.validateRequest(commentScema.comment_create),
    controller.createComment
);
router.get("/", verify, controller.getComment);
router.put("/:commentId",
    verify,
    validator.validateRequest(commentScema.comment_update),
    validator.validateParams(commentScema.params_commentId),
    controller.updateComment
);
router.delete("/:commentId",
    verify,
    validator.validateParams(commentScema.params_commentId),
    controller.deleteComment
);

module.exports = router
