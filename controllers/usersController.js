import User from "../models/User.js";
import Note from "../models/Note.js";
import bcrypt from "bcrypt";

const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "User Not Found!!" });
  }
  res.json(users);
};

const createUser = async (req, res) => {
  const { username, password, roles } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All Fields Required" });
  }

  const duplicate = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "User Already Exist" });
  }

  const hashedPwd = await bcrypt.hash(password, 10);

  const userObject =
    !roles.length || !Array.isArray(roles)
      ? { username, password: hashedPwd }
      : { username, password: hashedPwd, roles };

  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({ message: `New User ${user.username} Created` });
  } else {
    res.status(400).json({ message: "Invalid User Data" });
  }
};

const updateUser = async (req, res) => {
  const { id, username, password, roles, active } = req.body;

  if (
    !id ||
    !username ||
    !roles.length ||
    !Array.isArray(roles) ||
    password ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "All Fields Required!" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User Not Found" });
  }

  const duplicate = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "User Already Exist" });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
    user.password = await password;
  }

  const updatedUser = await user.save();

  res.json({ message: `User ${username} Updated ` });
};

const deleteUser = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User Id Required" });
  }

  const note = await Note.findOne({ user: id }).lean().exec();

  if (note?.length) {
    return res.status(400).json({ message: "User Has Notes" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User Not Found" });
  }

  const result = await user.deleteOne();

  const replay = `Username ${result.username} with ID ${result._id} deleted`;

  res.json(replay);
};

export { getAllUsers, createUser, updateUser, deleteUser };
