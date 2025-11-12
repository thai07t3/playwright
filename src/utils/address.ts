export interface RealAddress {
  country: string;
  state: string;
  city: string;
  postcode: string;
  address: string;
}

// Valid country codes supported by the website - using most common ones first
const VALID_COUNTRY_CODES = [
  "US",
  "CA",
  "GB",
  "AU",
  "DE",
  "FR",
  "IT",
  "ES",
  "NL",
  "BE",
  "CH",
  "AT",
  "DK",
  "SE",
  "NO",
  "FI",
  "IE",
  "PT",
  "GR",
  "LU",
  "PL",
  "CZ",
  "HU",
  "SK",
  "SI",
  "EE",
  "LV",
  "LT",
  "BG",
  "RO",
  "HR",
  "MT",
  "CY",
  "JP",
  "KR",
  "CN",
  "IN",
  "SG",
  "HK",
  "TW",
  "TH",
  "MY",
  "ID",
  "PH",
  "VN",
  "BR",
  "MX",
  "AR",
  "CL",
  "CO",
  "PE",
  "UY",
  "VE",
  "ZA",
  "EG",
  "MA",
  "NG",
  "KE",
  "GH",
  "TN",
  "DZ",
  "ET",
  "UG",
  "ZM",
  "ZW",
  "MZ",
  "BW",
  "NA",
  "SZ",
  "LS",
  "MW",
  "RW",
  "BI",
  "TZ",
  "KM",
  "SC",
  "MU",
  "MG",
  "RE",
  "YT",
];

export class RealAddressGenerator {
  private static extractAddressInfo(place: any): RealAddress {
    const address = place.address;

    // Get proper street address with building number/name
    const streetComponents = [];
    if (address.house_number) streetComponents.push(address.house_number);
    if (address.road || address.street)
      streetComponents.push(address.road || address.street);
    if (streetComponents.length === 0 && address.building)
      streetComponents.push(address.building);
    if (streetComponents.length === 0 && address.attraction)
      streetComponents.push(address.attraction);

    const streetAddress =
      streetComponents.length > 0
        ? streetComponents.join(" ")
        : place.display_name.split(",")[0] || "123 Main Street"; // fallback

    // Use Intl.DisplayNames to get full country name from country code
    let countryFullName = address.country || "";
    try {
      if (address.country_code) {
        const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
        countryFullName =
          regionNames.of(address.country_code.toUpperCase()) ||
          address.country ||
          address.country_code;
      }
    } catch (error) {
      // Fallback to original country name if Intl fails
      countryFullName = address.country || address.country_code || "";
    }

    return {
      country: countryFullName,
      state:
        address.state ||
        address.region ||
        address.county ||
        address.province ||
        "",
      city:
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        "",
      postcode: address.postcode || address.postal_code || "",
      address: streetAddress,
    };
  }

  static async generateAddressByCountry(
    countryCode: string,
  ): Promise<RealAddress> {
    try {
      // Try different search strategies to get complete address data
      const searchStrategies = [
        // Look for specific streets with house numbers
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=20&country=${countryCode}&street=main`,
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=20&country=${countryCode}&street=first`,
        // Look for residential areas
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=20&country=${countryCode}&class=highway`,
        // Look for places
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=20&country=${countryCode}&class=place`,
        // General search
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=20&country=${countryCode}`,
      ];

      for (const url of searchStrategies) {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.length > 0) {
          // Find the best result with the most complete address components
          for (const place of data) {
            if (place.address && place.address.country) {
              const extractedAddress = this.extractAddressInfo(place);

              // Prioritize addresses with more complete data
              const completeness = [
                extractedAddress.country,
                extractedAddress.state,
                extractedAddress.city,
                extractedAddress.postcode,
                extractedAddress.address,
              ].filter((field) => field && field.trim().length > 0).length;

              if (completeness >= 3) {
                // Lower threshold to 3 out of 5 fields filled
                return extractedAddress;
              }
            }
          }
        }

        // Small delay to avoid overwhelming the API
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      throw new Error(
        `No complete addresses found for country: ${countryCode}`,
      );
    } catch (error) {
      console.error("Error fetching address by country:", error);
      throw error;
    }
  }

  // New method to get a random valid country code
  static getRandomValidCountryCode(): string {
    const randomIndex = Math.floor(Math.random() * VALID_COUNTRY_CODES.length);
    return VALID_COUNTRY_CODES[randomIndex]!;
  }

  // New method to generate address with a valid country
  static async generateValidAddress(): Promise<RealAddress> {
    let retries = 3;

    while (retries > 0) {
      try {
        const countryCode = this.getRandomValidCountryCode();
        const address = await this.generateAddressByCountry(countryCode);

        // Validate critical fields are populated (country, city, and address are mandatory)
        if (address.country && address.city && address.address) {
          // Fill in missing fields with reasonable defaults
          if (!address.state) address.state = address.city; // Use city as state fallback
          if (!address.postcode) address.postcode = "00000"; // Generic postcode fallback

          return address;
        } else {
          console.warn(
            `Missing critical address data for ${countryCode}, trying again...`,
            address,
          );
          throw new Error("Missing critical address data");
        }
      } catch (error) {
        retries--;
        console.warn(
          `Failed to generate address, retries left: ${retries}`,
          error,
        );
      }
    }

    // Enhanced fallback with complete data
    console.warn("All retries failed, using fallback US address");
    return {
      country: "United States",
      state: "California",
      city: "San Francisco",
      postcode: "94102",
      address: "123 Main Street",
    };
  }
}
