import { IsEmail, Length } from "class-validator";

export class CreateCustomerInputs {
  @IsEmail()
  email: string;

  @Length(7, 30)
  phone: string;

  @Length(7, 12)
  password: string;
}

export interface CustomerPayload {
  _id: string;
  email: string;
  verified: boolean;
}

export class customerLoginInputs {
  @IsEmail()
  email: string;

  @Length(7, 12)
  password: string;
}

export class CustomerUpdateProfileInputs {
  @Length(5, 15)
  firstName: string;

  @Length(5, 15)
  lastName: string;

  @Length(5, 15)
  address: string;
}
