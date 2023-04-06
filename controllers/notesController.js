import User from "../models/User.js";
import Note from "../models/Note.js";

const getAllNotes = async (req, res) => {
  const notes = await Note.find().lean();

  if (!notes?.length) {
    return res.status(400).json({ message: "Notes Not Found" });
  }

  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();
      return { ...note, user: user?.username };
    })
  );

  res.json(notesWithUser);
};

const createNote = async (req, res) => {
  const { user, title, text } = req.body;

  if (!user || !title || !text) {
    return res.status(400).json({ message: "All Fields Required" });
  }

  const duplicate = await Note.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Note Title Already Exist" });
  }

  const note = await Note.create({ user, title, text });

  if (note) {
    return res.status(201).json({ message: "Note is created" });
  } else {
    return res.status(400).json({ message: "Somthing Went Wrong" });
  }
};

const updateNote = async (req, res) => {
  const { id, user, title, text, completed } = req.body;

  if (!id || !user || !title || !text || typeof completed !== "boolean") {
    return res.status(400).json({ message: "All Fields Required" });
  }

  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: "No Notes Found" });
  }

  const duplicate = await Note.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Note Already Exist" });
  }

  note.user = user;
  note.title = title;
  note.text = text;
  note.completed = completed;

  const updatedNote = await note.save();

  res.json(`'${updatedNote.title}' updated`);
};

const deleteNote = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Note ID required" });
  }

  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: "Note Not Found" });
  }

  const result = await note.deleteOne();

  const replay = `Note '${result.title}' with ID ${result._id} is deleted`;

  res.json(replay);
};

export { getAllNotes, createNote, updateNote, deleteNote };
