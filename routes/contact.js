import express from "express";
import { createContact } from "../controllers/contact.js";

const contactRouter = express.Router();

// Route to create a new contact
contactRouter.post("/create-contact", createContact);

export default contactRouter;
