import mongoose, { Schema } from "mongoose";

/*
  • detrmine what kind of data it will come to this model
  • ensures that the documents you work with have the correct structure and types
  • It helps catch errors at compile time, reducing runtime errors
*/
interface VendorDoc extends Document {
  name: string;
  ownerName: string;
  foodType: [string];
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  salt: string;
  serviceAvailable: boolean;
  coverImages: [string];
  rating: number;
  //   foods: any;
}

const VendorSchema = new Schema(
  {
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    foodType: { type: [String] },
    pincode: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    serviceAvailable: { type: Boolean },
    coverImages: { type: String },
    rating: { type: Number },
    // foods: {
    //   type: mongoose.SchemaTypes.ObjectId,
    //   ref: "food",
    // },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    // when it created or updates it will automatically add the last 2 fields
    timestamps: true,
  }
);

const vendor = mongoose.model<VendorDoc>("vendor", VendorSchema);

export { vendor };
