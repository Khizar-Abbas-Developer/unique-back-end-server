import contactModal from "../models/contact.js";

export const createContact = async (request, reply) => {
  const { firstName, lastName, email, contactNumber, message } = request.body;
  try {
    const newContact = await contactModal.create({
      firstName,
      lastName,
      email,
      contactNumber,
      message,
    });
    reply.status(201).send({
      message: "Contact created successfully",
      newContact,
    });
  } catch (error) {
    console.error(error);
    reply.status(500).send({
      message: "Failed to create contact",
    });
  }
};
