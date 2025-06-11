const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
}); 

// Adding a virtual for the full name 
// This allows us to create a field like user.name and it will take the user.firstname and user.lastname and automatically put them together for us This still allows us to keep the two separate but use both in one field on the front end. This name field is not stored in the database rather it takes what fields we are using to create it from the database. 
userSchema.virtual("name").get(function () {
  return `${this.firstname} ${this.lastname}`.trim();
});

userSchema.set("toJSON", {
  virtuals: true, // <-- This enables 'name' to be included
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  },
});

module.exports = mongoose.model("User", userSchema);
