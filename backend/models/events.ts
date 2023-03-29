import { Schema, Model, model } from "mongoose";

export interface EventsModel {
    name: string;
    location: string;
}

const eventsSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    location: {
        type: String,
        trim: true,
        required: true,
    }
});

export const EventsModel: Model<EventsModel> = model('Events', eventsSchema);