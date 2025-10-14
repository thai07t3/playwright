import { PersonRepository } from './models/PersonRepository.ts'

async function main(): Promise<void> {
    const repository = new PersonRepository()
    
    try {
        console.log('Loading people from JSON...')
        
        // Load people from JSON
        const people = await repository.loadPeople()
        console.log(`Loaded ${people.length} people successfully!\n`)
        
        // Call celebrateBirthday() on each person
        console.log('Celebrating birthdays...')
        people.forEach(person => {
            person.celebrateBirthday()
        })
        console.log('All birthdays celebrated! 🎉\n')
        
        // Print each person's greet() and isAdult() status
        console.log('People information:')
        console.log('='.repeat(50))
        people.forEach((person, index) => {
            console.log(`${index + 1}. ${person.greet()}`)
            console.log(`   Adult status: ${person.isAdult() ? 'Adult' : 'Minor'}`)
            console.log()
        })
        
        // Save the updated list to people.output.json
        console.log('Saving updated people list...')
        await repository.savePeople(people)
        
        console.log('\n✅ Process completed successfully!')
        
    } catch (error) {
        console.error('❌ Error occurred:', error instanceof Error ? error.message : 'Unknown error')
        process.exit(1)
    }
}

// Run the main function
main().catch(error => {
    console.error('❌ Fatal error:', error instanceof Error ? error.message : 'Unknown error')
    process.exit(1)
})