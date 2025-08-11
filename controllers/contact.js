import contactModal from "../models/contact.js";

export const createContact = async (req, res) => {
  const { firstName, lastName, email, contactNumber, message } = req.body;
  try {
    const newContact = await contactModal.create({
      firstName,
      lastName,
      email,
      contactNumber,
      message,
    });
    res
      .status(201)
      .json({ message: "Contact created successfully", newContact });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create contact",
    });
  }
};
