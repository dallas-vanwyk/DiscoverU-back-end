const express = require("express");
const router = express.Router();

const User = require("../models/user");

const verifyToken = require("../middleware/verify-token");

router.get("/", verifyToken, async (req, res) => {
  try {

    // Had to edit this line in order to allow the network page to be functional. I took out the .find({}, 'username) in order to ensure all user data was being sent to the front end. This should allow the user to see all other users when they open the network page.
    // const users = await User.find({}, "username");

    const users = await User.find();

    res.json(users);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get("/:userId", verifyToken, async (req, res) => {
  try {
    if (req.user._id !== req.params.userId) {
      return res.status(403).json({ err: "Unauthorized" });
    }

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ err: "User not found." });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.put("/:userId/edit", verifyToken, async (req, res) => {
  try {
    if (req.user._id !== req.params.userId) {
      return res.status(403).json({ err: "Unauthorized" });
    }

    const updates = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      avatar: req.body.avatar,
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      updates,
      { new: true, select: "-hashedPassword" } // exclude password from response
    );

    if (!updatedUser) {
      return res.status(404).json({ err: "User not found." });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
