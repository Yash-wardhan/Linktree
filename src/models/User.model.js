import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  userurl: { type: String, unique: true, required: true },
  links: [
    {
      title: String,
      url: String,
      icon: String,
      order: Number,
    },
  ],
  bio: { type: String, default: "" },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);