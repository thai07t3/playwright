import type { CartItem } from "./cart.item.ts";

export class Product {
  private _type: string;
  private _name: string;
  private _rating: number;
  private _totalRatings: number;
  private _price: number;

  constructor(
    type: string,
    name: string,
    rating: number,
    totalRatings: number,
    price: number,
  ) {
    this._type = type;
    this._name = name;
    this._rating = rating;
    this._totalRatings = totalRatings;
    this._price = price;
  }

  get type(): string {
    return this._type;
  }

  get name(): string {
    return this._name;
  }

  get rating(): number {
    return this._rating;
  }

  get totalRatings(): number {
    return this._totalRatings;
  }

  get price(): number {
    return this._price;
  }

  toCartItem(quantity: number = 1): CartItem {
    const subtotal = (this._price * quantity).toFixed(2);
    return {
      name: this._name,
      price: this._price.toString(),
      quantity: quantity,
      subtotal: subtotal,
    };
  }
}
