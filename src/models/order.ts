export interface OrderInfo {
  orderNumber: string;
  date: string;
  total: string;
  email: string;
  paymentMethod: string;
}

export class Order {
  constructor(
    public orderNumber: string,
    public date: string,
    public total: string,
    public email: string,
    public paymentMethod: string,
  ) {}

  static fromOrderOverview(
    orderNumber: string,
    date: string,
    email: string,
    total: string,
    paymentMethod: string,
  ): Order {
    // Clean up text data that might have labels
    const cleanOrderNumber = orderNumber.replace("Order number:", "").trim();
    const cleanDate = date.replace("Date:", "").trim();
    const cleanEmail = email.replace("Email:", "").trim();
    const cleanTotal = total.replace("Total:", "").trim();
    const cleanPaymentMethod = paymentMethod
      .replace("Payment method:", "")
      .trim();

    return new Order(
      cleanOrderNumber,
      cleanDate,
      cleanTotal,
      cleanEmail,
      cleanPaymentMethod,
    );
  }
}
