const httpMock = require('node-mocks-http');
const CommentsController = require('../../controllers/comments.controllers');
const { Comment } = require('../../models');

jest.mock('../../models');
let req, res, next;

const createComment = {
    dataValues: {
        "id": 1,
        "comment": "Lorem ipsum dolor sit amet",
        "UserId": 3,
        "PhotoId": 1
    }
}
const comments = [{
    "id": 1,
    ...createComment,
    "UserId": 3
}]

const updateComment = {
    "comment": "Lorem ipsum dolor sit amet",
    "UserId": 3,
    "PhotoId": 1
}

beforeEach(() => {
    req = httpMock.createRequest();
    res = httpMock.createResponse();
    next = jest.fn();
});

describe('CommentsController.getComments', () => {
    it("Should return 200 and return comments", async () => {
        req.userId = 3

        Comment.findAll.mockResolvedValue(comments);

        await CommentsController.getComments(req, res, next);

        expect(res.statusCode).toEqual(200);
        expect(res._getJSONData()).toHaveProperty("comments", comments)
    });

    it("Should handle errors", async () => {
        req.userId = 3;
        Comment.findAll.mockRejectedValue({ message: "Handle error getComments" });

        await CommentsController.getComments(req, res, next);
        expect(next).toHaveBeenCalled();
    })
});

describe('CommentsController.createComment', () => {
    it("Should return code 201 and comment", async () => {
        Comment.create.mockResolvedValue(createComment);

        await CommentsController.createComment(req, res, next);

        expect(res.statusCode).toEqual(201);
        expect(res._getJSONData()).toHaveProperty("comment", createComment)
    });

    it("Should handle errors", async () => {
        Comment.create.mockRejectedValue({ message: "Handle error createComment" });

        await CommentsController.createComment(req, res, next);
        expect(next).toHaveBeenCalled();
    })
})

describe('CommentsController.updateComment', () => {
    it("Should return code 200 and comment", async () => {
        Comment.update.mockResolvedValue(updateComment);

        await CommentsController.updateComment(req, res, next);

        expect(res.statusCode).toEqual(200);
        expect(res._getJSONData()).toHaveProperty("comment", updateComment)
    })

    it("Should return 404 when socmed not found", async () => {
        Comment.update.mockResolvedValue(null);

        await CommentsController.updateComment(req, res, next);

        expect(res.statusCode).toEqual(404);
        expect(res._getJSONData()).toHaveProperty("message", "Comment not found");
    })

    it("Should handle errors", async () => {
        Comment.update.mockRejectedValue({ message: "Handle error updateComment" });

        await CommentsController.updateComment(req, res, next);
        expect(next).toHaveBeenCalled();
    })
})

describe('CommentsController.deleteComment', () => {
    it("Should return code 200 and comment", async () => {
        Comment.destroy.mockResolvedValue(1);

        await CommentsController.deleteComment(req, res, next);

        expect(res.statusCode).toEqual(200);
        expect(res._getJSONData()).toHaveProperty("message", "Comment deleted");
    });

    it("Should return 404 when comment not found", async () => {
        Comment.destroy.mockResolvedValue(0);

        await CommentsController.deleteComment(req, res, next);
        expect(res.statusCode).toEqual(404);
        expect(res._getJSONData()).toHaveProperty("message", "Comment not found");
    });

    it("Should handle errors", async () => {
        Comment.destroy.mockRejectedValue({ message: "Handle error deleteComment" });

        await CommentsController.deleteComment(req, res, next);
        expect(next).toHaveBeenCalled();
    })
});
