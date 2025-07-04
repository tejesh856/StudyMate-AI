import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
    },
    profilePic: {
      type: String, // Store image URL or file path
      default: "",
    },
    color: {
      type: String,
      default: "",
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Pre-save middleware to hash the password before saving to the database
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next(); // Prevent re-hashing on updates

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);

export default User;