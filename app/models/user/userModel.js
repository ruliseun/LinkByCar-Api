import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    profile_image: {
      type: String,
      default:
        "https://conferenceoeh.com/wp-content/uploads/profile-pic-dummy.png",
    },
    phone_no: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
    createdAt: Number,
    updatedAt: Number,
  },
  {
    timestamps: {
      currentTime: () => new Date().valueOf().toString(),
    },
  }
);

UserSchema.pre("save", async function (next) {
  const role = await mongoose.model("Role").findById(this.role);

  if (!role.permissions.includes("read")) {
    throw new Error("User does not have the necessary permissions");
  }

  next();
});

export default mongoose.model("User", UserSchema);
