const express = require("express");
const router = express.Router();

const {
  getAllJobs,
  getJob,
  createJob,
  deleteJob,
  UpdateJob,
} = require("../controllers/jobs");

router.route("/").post(createJob).get(getAllJobs);
router.route("/:id").get(getJob).delete(deleteJob).patch(UpdateJob);

module.exports = router;
