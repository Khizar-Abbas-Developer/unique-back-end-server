import express from "express";
import { createContact } from "../controllers/contact.js";
const contactRouter = express.Router();

contactRouter.post("/create-contact", createContact);

export default contactRouter;
