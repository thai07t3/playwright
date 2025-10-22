import * as fs from "fs";
import * as path from "path";

export interface CustomerData {
  firstName: string;
  lastName: string;
  companyName?: string;
  country: string;
  streetAddress: string;
  apartment: string;
  postcode: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  orderNotes?: string;
}

export class CustomerInfo {
  public firstName: string;
  public lastName: string;
  public companyName?: string;
  public country: string;
  public streetAddress: string;
  public apartment: string;
  public postcode: string;
  public city: string;
  public state: string;
  public phone: string;
  public email: string;
  public orderNotes?: string;

  constructor(data: CustomerData) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    if (data.companyName) {
      this.companyName = data.companyName;
    }
    this.country = data.country;
    this.streetAddress = data.streetAddress;
    this.apartment = data.apartment;
    this.postcode = data.postcode;
    this.city = data.city;
    this.state = data.state;
    this.phone = data.phone;
    this.email = data.email;
    if (data.orderNotes) {
      this.orderNotes = data.orderNotes;
    }
  }

  toObject(): CustomerData {
    return JSON.parse(JSON.stringify(this));
  }
}

export class CustomerRepository {
  private static readonly CUSTOMER_DATA_PATH = path.join(
    process.cwd(),
    "data/customer.json",
  );

  static loadCustomer(): CustomerInfo {
    try {
      const customerData = JSON.parse(
        fs.readFileSync(this.CUSTOMER_DATA_PATH, "utf-8"),
      ) as CustomerData;
      return new CustomerInfo(customerData);
    } catch (error) {
      throw new Error(
        `Failed to load customer data from ${this.CUSTOMER_DATA_PATH}: ${error}`,
      );
    }
  }

  static getCustomerData(): CustomerData {
    try {
      return JSON.parse(
        fs.readFileSync(this.CUSTOMER_DATA_PATH, "utf-8"),
      ) as CustomerData;
    } catch (error) {
      throw new Error(
        `Failed to load customer data from ${this.CUSTOMER_DATA_PATH}: ${error}`,
      );
    }
  }

  static saveCustomer(customerData: CustomerData): void {
    try {
      fs.writeFileSync(
        this.CUSTOMER_DATA_PATH,
        JSON.stringify(customerData, null, 4),
        "utf-8",
      );
    } catch (error) {
      throw new Error(
        `Failed to save customer data to ${this.CUSTOMER_DATA_PATH}: ${error}`,
      );
    }
  }

  static updateCustomer(updates: Partial<CustomerData>): CustomerInfo {
    const currentData = this.getCustomerData();
    const updatedData = { ...currentData, ...updates };
    this.saveCustomer(updatedData);
    return new CustomerInfo(updatedData);
  }
}

export function getUser(): { username: string; password: string } {
  return {
    username: process.env.USERNAME || "",
    password: process.env.PASSWORD || "",
  };
}
