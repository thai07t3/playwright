export class Product {
    private type: string;
    private name: string;
    private rating: number;
    private totalRatings: number;
    private price: number;

    constructor(type: string, name: string, rating: number, totalRatings: number, price: number) {
        this.type = type;
        this.name = name;
        this.rating = rating;
        this.totalRatings = totalRatings;
        this.price = price;
    }

    get getType(): string {
        return this.type;
    }

    get getName(): string {
        return this.name;
    }

    get getRating(): number {
        return this.rating;
    }

    get getTotalRatings(): number {
        return this.totalRatings;
    }

    get getPrice(): number {
        return this.price;
    }
}