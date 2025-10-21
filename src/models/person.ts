class Person {
    private name: string
    private age: number
    city: string

    constructor(name: string, age: number, city: string) {
        if (!name || name.trim() === '') {
            throw new Error('Name cannot be empty')
        }
        if (age <= 0) {
            throw new Error('Age must be positive')
        }

        this.name = name
        this.age = age
        this.city = city
    }

    greet(): string {
        return `Hi, I'm ${this.name} from ${this.city}.`
    }

    celebrateBirthday(): void {
        this.age++
    }

    updateCity(newCity: string): void {
        this.city = newCity
    }

    isAdult(): boolean {
        return this.age >= 18
    }

    hasSameCity(other: Person): boolean {
        return this.city === other.city
    }

    // Getters for all properties
    get getName(): string {
        return this.name
    }

    get getAge(): number {
        return this.age
    }

    get getCity(): string {
        return this.city
    }

    // Serialization methods
    toJSON(): object {
        return {
            name: this.name,
            age: this.age,
            city: this.city
        }
    }

    static fromJSON(data: any): Person {
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid data provided for Person.fromJSON')
        }

        const { name, age, city } = data

        if (typeof name !== 'string' || typeof age !== 'number' || typeof city !== 'string') {
            throw new Error('Invalid data types in JSON data')
        }

        return new Person(name, age, city)
    }
}

export default Person