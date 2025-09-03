// routes/contact.js
import { createContact } from "../controllers/contact.js";

async function contactRouter(fastify, options) {
  fastify.post("/create-contact", createContact);
}

export default contactRouter;
