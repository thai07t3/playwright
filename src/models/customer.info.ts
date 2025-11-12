import { faker } from "@faker-js/faker";
import type { RealAddress } from "../utils/address.ts";
import { RealAddressGenerator } from "../utils/address.ts";

export interface CustomerData {
  firstName: string;
  lastName: string;
  companyName?: string;
  email: string;
  phone: string;
  address: RealAddress;
}

export class CustomerInfo {
  public firstName: string;
  public lastName: string;
  public companyName?: string;
  public email: string;
  public phone: string;
  public address: RealAddress;

  constructor(address: RealAddress) {
    this.firstName = faker.person.firstName();
    this.lastName = faker.person.lastName();
    this.companyName = faker.company.name();
    this.email = faker.internet.email({
      firstName: this.firstName,
      lastName: this.lastName,
      provider: "example.com",
    });
    this.phone = faker.phone.number({ style: "international" });
    this.address = address;
  }

  // Static factory method to create CustomerInfo with address
  static async create(): Promise<CustomerInfo> {
    const address = await RealAddressGenerator.generateValidAddress();
    return new CustomerInfo(address);
  }

  // Alternative static factory method to create CustomerInfo with specific country
  static async createWithCountry(countryCode: string): Promise<CustomerInfo> {
    const address =
      await RealAddressGenerator.generateAddressByCountry(countryCode);
    return new CustomerInfo(address);
  }
}
