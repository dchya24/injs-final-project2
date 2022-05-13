const express = require("express");
const router = express.Router();
const controller = require("../controllers/socmed.controller");
const { verify } = require("../middlewares/auth");
const validator = require("../middlewares/validator");
const socmedScema = require("../middlewares/schema/socmed.scema")

router.post("/",
    verify,
    validator.validateRequest(socmedScema.socmed_create),
    controller.createSocmed
);
router.get("/", verify, controller.getSocmed);
router.put("/:socmedId",
    verify,
    validator.validateRequest(socmedScema.socmed_create),
    validator.validateParams(socmedScema.socmed_params),
    controller.updateSocmed
);
router.delete("/:socmedId",
    verify,
    validator.validateParams(socmedScema.socmed_params),
    controller.deleteSocmed
);

module.exports = router
