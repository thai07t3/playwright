export interface CartItem {
    name: string;
    price: string;
    quantity: number;
    subtotal: string;
    thumbnail: string | undefined;
    removeLink: string | undefined;
}