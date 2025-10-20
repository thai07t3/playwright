import { faker } from '@faker-js/faker';

export class CustomerInfo {
    public firstName: string;
    public lastName: string;
    public companyName?: string;
    public country: string;
    public streetAddress: string;
    public apartment: string;
    public postcode: string = '';
    public city: string = '';
    public state: string = '';
    public phone: string;
    public email: string;
    public orderNotes?: string;

    // Constructor overloads
    constructor();
    constructor(
        firstName: string,
        lastName: string,
        country: string,
        streetAddress: string,
        apartment: string,
        city: string,
        state: string,
        phone: string,
        email: string,
        companyName?: string,
        postcode?: string,
        orderNotes?: string
    );
    constructor(
        firstName?: string,
        lastName?: string,
        country?: string,
        streetAddress?: string,
        apartment?: string,
        city?: string,
        state?: string,
        phone?: string,
        email?: string,
        companyName?: string,
        postcode?: string,
        orderNotes?: string
    ) {
        if (firstName && lastName && country && streetAddress && apartment && city && state && phone && email) {
            // Constructor with parameters
            this.firstName = firstName;
            this.lastName = lastName;
            this.country = country;
            this.streetAddress = streetAddress;
            this.apartment = apartment;
            this.city = city;
            this.state = state;
            this.phone = phone;
            this.email = email;
            
            // Handle optional properties
            if (companyName !== undefined) {
                this.companyName = companyName;
            }
            if (postcode !== undefined) {
                this.postcode = postcode;
            }
            if (orderNotes !== undefined) {
                this.orderNotes = orderNotes;
            }
        } else {
            // Default constructor with faker - generate consistent data
            this.firstName = faker.person.firstName();
            this.lastName = faker.person.lastName();
            this.companyName = faker.company.name();
            this.country = this.getRandomCountry();
            
            // Generate location data based on country
            this.generateLocationData();
            
            this.streetAddress = faker.location.streetAddress();
            this.apartment = faker.location.secondaryAddress();
            this.phone = faker.string.numeric(10);
            this.email = faker.internet.email();
            this.orderNotes = faker.lorem.sentence();
        }
    }

    // Static method to create customer with specific data
    static createCustomer(data?: Partial<CustomerInfo>): CustomerInfo {
        const customer = new CustomerInfo();
        if (data) {
            Object.assign(customer, data);
        }
        return customer;
    }

    // Static method to create Vietnamese customer
    static createVietnameseCustomer(): CustomerInfo {
        const customer = new CustomerInfo();
        customer.country = 'VN';
        customer.generateLocationData(); // Use consistent data generation
        customer.phone = '0' + faker.string.numeric(9); // Vietnamese phone format
        return customer;
    }

    // Static method to create US customer
    static createUSCustomer(): CustomerInfo {
        const customer = new CustomerInfo();
        customer.country = 'US';
        customer.generateLocationData(); // Use consistent data generation
        return customer;
    }

    // Get a random country from common test countries
    private getRandomCountry(): string {
        const countries = [
            'US', // United States
            'VN', // Vietnam
            'GB', // United Kingdom
            'CA', // Canada
            'AU', // Australia
            'DE', // Germany
            'FR', // France
            'JP', // Japan
            'SG', // Singapore
            'TH'  // Thailand
        ];
        return faker.helpers.arrayElement(countries);
    }

    // Generate consistent location data based on country
    public generateLocationData(): void {
        switch (this.country) {
            case 'US':
                this.state = faker.location.state({ abbreviated: true });
                this.city = faker.location.city();
                this.postcode = faker.string.numeric(5);
                break;
            case 'GB':
                this.state = ''; // UK doesn't use states
                this.city = faker.helpers.arrayElement(['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds']);
                this.postcode = faker.string.alphanumeric({ length: 6, casing: 'upper' });
                break;
            case 'CA':
                this.state = faker.helpers.arrayElement(['ON', 'BC', 'AB', 'QC', 'MB']);
                this.city = faker.helpers.arrayElement(['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa']);
                this.postcode = faker.string.alphanumeric({ length: 6, casing: 'upper' });
                break;
            case 'AU':
                this.state = faker.helpers.arrayElement(['NSW', 'VIC', 'QLD', 'WA', 'SA']);
                this.city = faker.helpers.arrayElement(['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide']);
                this.postcode = faker.string.numeric(4);
                break;
            case 'DE':
                this.state = faker.helpers.arrayElement(['Bayern', 'Baden-Württemberg', 'Nordrhein-Westfalen']);
                this.city = faker.helpers.arrayElement(['Berlin', 'München', 'Hamburg', 'Köln', 'Frankfurt']);
                this.postcode = faker.string.numeric(5);
                break;
            case 'JP':
                this.state = faker.helpers.arrayElement(['Tokyo', 'Osaka', 'Kyoto', 'Yokohama']);
                this.city = faker.helpers.arrayElement(['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Nagoya']);
                this.postcode = faker.string.numeric(5);
                break;
            case 'VN':
                this.state = ''; // Vietnam doesn't use states in checkout
                this.city = faker.helpers.arrayElement(['Ho Chi Minh City', 'Ha Noi', 'Da Nang', 'Can Tho', 'Hai Phong']);
                this.postcode = faker.string.numeric(6);
                break;
            default:
                // Fallback for other countries
                this.state = faker.location.state();
                this.city = faker.location.city();
                this.postcode = faker.string.numeric(5);
        }
    }

    // Method to get full name
    getFullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    // Method to get full address
    getFullAddress(): string {
        const addressParts = [this.streetAddress];
        if (this.apartment) {
            addressParts.push(this.apartment);
        }
        addressParts.push(this.city);
        if (this.state) {
            addressParts.push(this.state);
        }
        if (this.postcode) {
            addressParts.push(this.postcode);
        }
        return addressParts.join(', ');
    }

    // Method to convert to object for easy logging/debugging
    toObject(): Record<string, string> {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            companyName: this.companyName || '',
            country: this.country,
            streetAddress: this.streetAddress,
            apartment: this.apartment,
            postcode: this.postcode || '',
            city: this.city,
            state: this.state,
            phone: this.phone,
            email: this.email,
            orderNotes: this.orderNotes || ''
        };
    }
}