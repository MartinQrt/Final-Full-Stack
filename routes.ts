import express from "express";
import jwt from "jsonwebtoken"

import { UserModel } from "./models/users";
import { ParticipantModel } from "./models/participants";
import { isLoggedIn } from "./utils/isLoggedIn";
import { comparePassword } from "./utils/passwordUtils";
import { TypedRequest } from "./types/request";
import { CreateParticipantRequest } from "./models/request/createParticipantRequest";
import { body, validationResult } from "express-validator";
import { UpdateParticipantRequest } from "./models/request/updateParticipantRequest";
import { EventsModel } from "./models/events";
import { CreateEventRequest } from "./models/request/createEventRequest";
import { UpdateEventRequest } from "./models/request/updateEventRequest";

const router = express.Router();

router.post("/login", async (req, res) => {
    const {email, password } =req.body;

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).send({ error: "Bad request"}).end();
    }
    
    if (!email || !password) {
        return res.status(400).send("User name or password is missing").end();
    }
    
    const user = await UserModel.findOne({ email });
    
    if (!user) {
        return res.status(400).send("Login failed").end();
    }
    
    const passwordMatches = await comparePassword(password, user.password);
    
    if (!passwordMatches) {
        return res.status(400).send("Passwords do not match").end();
    }
    
    const issuedAt = new Date().getTime();

    const userPayload = {
        email,
        issuedAt,
    };

    const token = jwt.sign(userPayload, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: process.env.JWT_EXPIRIES_IN,
    });

    const response = {
        accessToken: token,
        issuedAt,
    };

    return res.send(response).end();
});

router.get("/participants", isLoggedIn, async (req, res) => {
    const participants = await ParticipantModel.find().populate("event");
        
    return res.send(participants).end();
});

router.get("/participants/:id", isLoggedIn, async (req, res) => {
    const participant = await ParticipantModel.findById(req.params.id);
    return res.send(participant).end();
});

router.post(
    "/participants",
    body("birthday").isDate(),
    body("email").isEmail(),
    body("eventId").isString(),
    body("fullName").isString(),
    isLoggedIn,
    async (req: TypedRequest<CreateParticipantRequest>, res) => {
        const errors = validationResult(req);

        if (!errors.isEmty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { birthday, email, eventId, fullName } = req.body;

        const existingParticipant = await ParticipantModel.findOne({
            email,
            event: eventId,
        });

        if (existingParticipant) {
            return res.status(400).json("Participant already registered");
        }

        const participant = new ParticipantModel({
            birthDate: birthday,
            email,
            event: eventId,
            fullName,
        });

        const savedParticipant = await participant.save();

        return res.send(savedParticipant).end();
    }
);

router.put(
    "/events/:id",
    isLoggedIn,
    async (req: TypedRequest<UpdateEventRequest>, res) => {
      const id = req.params.id;
  
      const updatedEvent = await EventsModel.findOneAndUpdate(
        { _id: id },
        { ...req.body }
      );
  
      return res.send(updatedEvent).end();
    }
  );
  
  router.put(
    "/participants/:id",
    isLoggedIn,
    async (req: TypedRequest<UpdateParticipantRequest>, res) => {
      const id = req.params.id;
  
      const updatedParticipant = await ParticipantModel.findOneAndUpdate(
        { _id: id },
        { ...req.body, event: req.body.eventId }
      );
  
      return res.send(updatedParticipant).end();
    }
  );
  
  router.delete("/participants/:id", isLoggedIn, async (req, res) => {
    const participant = await ParticipantModel.findById(req.params.id);
  
    if (!participant) {
      return res.status(400).send("Participant does not exist");
    }
  
    await participant.delete();
  
    return res.status(200).send({}).end();
  });
  
  router.get("/events", isLoggedIn, async (req, res) => {
    const events = await EventsModel.find();
    return res.send(events).end();
  });
  
  router.get("/events/:id", isLoggedIn, async (req, res) => {
    const events = await EventsModel.findById(req.params.id);
    return res.send(events).end();
  });
  
  router.post(
    "/events",
    body("name").isString(),
    body("location").isString(),
    isLoggedIn,
    async (req: TypedRequest<CreateEventRequest>, res) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { name, location } = req.body;
  
      const existingEvent = await EventsModel.findOne({ name, location });
  
      if (existingEvent) {
        return res.status(400).json("Event already registered");
      }
  
      const event = new EventsModel({
        name,
        location,
      });
  
      const savedEvent = await event.save();
  
      return res.send(savedEvent).end();
    }
  );
  
  router.delete("/event/:id", isLoggedIn, async (req, res) => {
    const event = await EventsModel.findById(req.params.id);
    const eventParticipants = await ParticipantModel.find({
      event: req.params.id,
    });
  
    await event.delete();
    await Promise.all(
      eventParticipants.map((participant) => participant.delete())
    );
  
    return res.status(200).send({}).end();
  });
  
  router.get("/event/:id", isLoggedIn, async (req, res) => {
    const event = await EventsModel.findById(req.params.id);
    const eventParticipants = await ParticipantModel.find({
      event: req.params.id,
    });
    return res.send({ event, eventParticipants }).end();
  });

export { router };
