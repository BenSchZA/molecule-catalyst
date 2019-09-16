import { Schema, Document } from "mongoose";
import { MarketState } from "./market.reducer";

export interface Market extends IMarket {
  id: string;
}

interface IMarket {
  marketAddress: string,
  marketData: MarketState
}

export interface MarketDocument extends IMarket, Document { }

export const MarketSchema = new Schema({
    marketAddress: { type: String, required: true, unique: true, index: true},
    marketData: { type: Schema.Types.Mixed }
  }, {
      toJSON: {
        transform: (doc, ret) => {
          ret.id = String(ret._id);
          delete ret._id;
          return ret;
        },
      },
      toObject: {
        transform: (doc, ret) => {
          ret.id = String(ret._id);
          delete ret._id;
          return ret;
        },
      },
    });