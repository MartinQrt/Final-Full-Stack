import { Schema, Model, model, Types } from "mongoose";

export interface ParticipantModel {
    fullName: string;
    event: Types.ObjectId;
    email: string;
    birthDate: Date;
}

const participantSchema = new Schema({
    fullName: {
        type: String,
        trim: true,
        reguired: true,
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Events',
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required:true,
    },
    birthDate: {
        type: Date,
        required: true,
    }
});

export const ParticipantModel: Model<ParticipantModel> = model('Participants', participantSchema);