import { Schema, Document } from "mongoose";
import { VaultState } from "./vault.reducer";

export interface Vault extends IVault {
  id: string;
}

interface IVault {
  vaultAddress: string,
  vaultData: VaultState
}

export interface VaultDocument extends IVault, Document { }

export const VaultSchema = new Schema({
    vaultAddress: { type: String, required: true, unique: true, index: true},
    vaultData: { type: Schema.Types.Mixed }
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