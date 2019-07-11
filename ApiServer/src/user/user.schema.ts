import {Schema, Document} from 'mongoose';
import * as bcrypt from 'bcrypt';
import { env } from '../config/env';

export interface User {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface UserDocument extends User, Document { }

export const UserSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, select: false},
}, {
    timestamps: true,
    toJSON: {
        getters: true,
        versionKey: false,
        transform: (doc, ret) => {
            ret.id = String(ret._id);
            delete ret._id;
            return ret;
        },
        virtuals: true,
    },
    toObject: {
        getters: true,
        versionKey: false,
        transform: (doc, ret) => {
            ret.id = String(ret._id);
            delete ret._id;
            return ret;
        },
    },
});

UserSchema.pre('save', async function(this: UserDocument, next) {
    if (!this.isModified('password')) return next();

    const hashedPassword = await bcrypt.hash(this.password, env.bcrypt.saltRounds);
    this.password = hashedPassword;

    next();
});

UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.lastName;
});
