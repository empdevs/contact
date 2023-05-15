import { Timestamp } from "mongodb";
import mongoose from "mongoose";

mongoose.Promise = global.Promise;
export const ContactModel = mongoose.model('contacts',
  new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    phone: {
      type: Number,
      required: true
    },
  }));

export const UserModel = mongoose.model('users',
  new mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
  })
);

export const RefreshTokenModel = mongoose.model('refresh_tokens',
  new mongoose.Schema({
    userId: {
      type: String,
      required: true
    },
    refreshToken: {
      type: String,
      required: true
    }
  },
    {
      timestamps: true
    }
  )
);
