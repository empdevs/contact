import mongoose from "mongoose";
import { IUser } from "../Types";

mongoose.Promise = global.Promise;
export const ContactModel = mongoose.model('contacts',
  new mongoose.Schema({
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    phone: {
      type: Number,
      required: true
    },
  }));

export const UserModel = mongoose.model<IUser>('users',
  new mongoose.Schema({
    id: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    notification: {
      type: {
        token: {
          type: String,
          required: true
        },
        chatId: {
          type: String,
          required: true
        },
      },
    }
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
