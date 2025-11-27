import { faker } from '@faker-js/faker'

// Set a fixed seed for consistent data generation
faker.seed(12345)

export const customers = Array.from({ length: 100 }, () => {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    return {
        id: faker.string.uuid(),
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({ firstName }).toLocaleLowerCase(),
        phoneNumber: faker.phone.number({ style: 'international' }),
        status: faker.helpers.arrayElement([
            'active',
            'inactive',
            'blocked',
        ]),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
    }
})
