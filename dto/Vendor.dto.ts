export interface CreateVendorInput {
  name: string;
  ownerName: string;
  foodType: [string];
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
}

export interface VendorLoginInputs {
  email: string;
  password: string;
}

export interface VendorPayload {
  _id: string;
  email: string;
  foodType: [string];
  name: string;
}

export interface VendorUpdateInputs {
  name: string;
  phone: string;
  address: string;
  foodType: [string];
}
