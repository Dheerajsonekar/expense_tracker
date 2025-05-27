const express = require("express");
const router = express.Router();
const {
  forgotPassword,
  serveResetForm,
  updatePassword,
} = require("../controllers/passwordController");

router.post("/password/forgot-password", forgotPassword);
router.get("/password/resetpassword/:uuid", serveResetForm);
router.post("/password/updatepassword/:uuid", updatePassword);

module.exports = router;
