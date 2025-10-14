import * as fs from 'fs'
import * as path from 'path'
import Person from './Person.ts'

export class PersonRepository {
    private dataDir: string

    constructor(dataDir: string = 'data') {
        this.dataDir = dataDir
    }

    async loadPeople(): Promise<Person[]> {
        const filePath = path.join(this.dataDir, 'people.json')
        
        try {
            // Check if file exists
            if (!fs.existsSync(filePath)) {
                throw new Error(`File not found: ${filePath}`)
            }

            // Read and parse the JSON file
            const fileContent = fs.readFileSync(filePath, 'utf8')
            
            if (!fileContent.trim()) {
                throw new Error('File is empty')
            }

            const data = JSON.parse(fileContent)
            
            if (!Array.isArray(data)) {
                throw new Error('JSON file must contain an array of people')
            }

            // Map JSON objects to Person instances
            return data.map((personData, index) => {
                try {
                    return Person.fromJSON(personData)
                } catch (error) {
                    throw new Error(`Invalid person data at index ${index}: ${error instanceof Error ? error.message : 'Unknown error'}`)
                }
            })

        } catch (error) {
            if (error instanceof SyntaxError) {
                throw new Error(`Invalid JSON format in ${filePath}: ${error.message}`)
            }
            throw error
        }
    }

    async savePeople(people: Person[], filename: string = 'people.output.json'): Promise<void> {
        const filePath = path.join(this.dataDir, filename)
        
        try {
            // Ensure the data directory exists
            if (!fs.existsSync(this.dataDir)) {
                fs.mkdirSync(this.dataDir, { recursive: true })
            }

            // Convert Person instances to JSON objects
            const jsonData = people.map(person => person.toJSON())
            
            // Write to file with pretty formatting
            const jsonString = JSON.stringify(jsonData, null, 2)
            fs.writeFileSync(filePath, jsonString, 'utf8')
            
            console.log(`Successfully saved ${people.length} people to ${filePath}`)

        } catch (error) {
            throw new Error(`Failed to save people to ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }
}