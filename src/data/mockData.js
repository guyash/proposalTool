


// TODO add ID to each company
export const CompanyOptionsWithReferents = [
    {
        name: 'Apple',
        image: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
        referents: [
            {
                id: 1,
                name: "Steven Spielberg",
                email: "Steven@gmail.com",
                phone: "050-444-3344",
                role: 'CEO',
            },
            {
                id: 2,
                name: "Oprah Winfrey",
                email: "Oprah@gmail.com",
                phone: "050-555-3344",
                role: 'COO',
            },
            {
                id: 3,
                name: "Tom Hanks",
                email: "Tom@gmail.com",
                phone: "050-777-3344",
                role: 'CFO',
            },
            {
                id: 4,
                name: "Angelina Jolie",
                email: "Angelina@gmail.com",
                phone: "050-111-3344",
                role: 'HR',
            },
            {
                id: 5,
                name: "Stephen Hawking",
                email: "Stephen@gmail.com",
                phone: "050-999-3344",
                role: 'Developer',
            },
        ]
    },
    {
        name: 'Amazon',
        image: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Amazon_icon.png',
        referents: [
            {
                id: 6,
                name: "Brad Pitt",
                email: "brad@gmail.com",
                phone: "050-222-3344",
                role: 'CEO',
            },
            {
                id: 7,
                name: "Jennifer Aniston",
                email: "jen@gmail.com",
                phone: "050-333-3344",
                role: 'COO',
            },
            {
                id: 8,
                name: "Leonardo DiCaprio",
                email: "leo@gmail.com",
                phone: "050-444-3344",
                role: 'CFO',
            },
            {
                id: 9,
                name: "Emma Watson",
                email: "emma@gmail.com",
                phone: "050-555-3344",
                role: 'HR',
            },
            {
                id: 10,
                name: "Chris Hemsworth",
                email: "chris@gmail.com",
                phone: "050-666-3344",
                role: 'Developer',
            },
        ]
    },
    {
        name: 'Facebook',
        image: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg',
        referents: [
            {
                id: 11,
                name: "Mark Zuckerberg",
                email: "mark@gmail.com",
                phone: "050-777-3344",
                role: 'CEO',
            },
            {
                id: 12,
                name: "Sheryl Sandberg",
                email: "sheryl@gmail.com",
                phone: "050-888-3344",
                role: 'COO',
            },
            {
                id: 13,
                name: "Jeff Bezos",
                email: "jeff@gmail.com",
                phone: "050-999-3344",
                role: 'CFO',
            },
            {
                id: 14,
                name: "Elon Musk",
                email: "elon@gmail.com",
                phone: "050-111-3344",
                role: 'HR',
            },
            {
                id: 15,
                name: "Tim Cook",
                email: "tim@gmail.com",
                phone: "050-222-3344",
                role: 'Developer',
            },
        ]
    }
];

export const initialReferentsTableRows = [
    {
        id: 1,
        name: "Steven Spielberg",
        email: "Steven@gmail.com",
        phone: "050-444-3344",
        role: 'CEO',
    },
    {
        id: 2,
        name: "Oprah Winfrey",
        email: "Oprah@gmail.com",
        phone: "050-555-3344",
        role: 'COO',
    },
    {
        id: 3,
        name: "Tom Hanks",
        email: "Tom@gmail.com",
        phone: "050-777-3344",
        role: 'CFO',
    },
    {
        id: 4,
        name: "Angelina Jolie",
        email: "Angelina@gmail.com",
        phone: "050-111-3344",
        role: 'HR',
    },
    {
        id: 5,
        name: "Stephen Hawking",
        email: "Stephen@gmail.com",
        phone: "050-999-3344",
        role: 'Developer',
    },
];




export const initialPricingTableRows = [
    {
        id: 1,
        phase: "Scoping Sessions",
        units: "0",
        price: 'Included',
    },
    {
        id: 2,
        phase: "Scoping mid level",
        units: "0",
        price: 'Included',
    },
    {
        id: 3,
        phase: "Individual development plan",
        units: "0",
        price: 'Included',
    },
    {
        id: 4,
        phase: "Practicum",
        units: "0",
        price: 'Included',
    },
    {
        id: 5,
        phase: "Scenario harvesting",
        units: "0",
        price: 'Included',
    },
    {
        id: 6,
        phase: "Pods",
        units: "0",
        price: 'Included',
    },
    {
        id: 7,
        phase: "Steering Committee",
        units: "0",
        price: 'Included',
    },
    {
        id: 8,
        phase: "Academy mid level",
        units: "0",
        price: 'Included',
    },
];


export const programStructureOptionsWithIndexes = {

    VayomarGPT: {
        'Academy mid level': 5,
        'Individual development plan': 6,
        'Pods': 7,
        'Practicum': 8,
        'Scenario harvesting': 9,
        'Scoping mid level': 10,
        'Scoping': 11,
        'Steering Committee': 12,
        'Scoping & Design Sessions': 13,
        '1-on-1 Interviews': 14,
        '1-on-1 Coaching Sessions': 15,
        'Role-playing Kits': [16, 17],
        'Kickoff Sessions': 18,
        'Steering Committee Calls': 19,
        'Pod Coaching Sessions': 20,
        'Program Debrief': 21,
        'Teaser Campaign': 22,
        'Vayomar Online Users': 23,
        'Virtual Workshops': [],
        'In-person Workshops': [],
        'Half-day workshops': [],
        'Full-day workshops': [],
        'Facilitation Days': [],
        'Keynote Sessions': [],
        'Retainer Months': [],
        'Local Lodging': [],
        'Airfare - Local Flights': [],
        'Airfare - International Flights': []
    },

    GenesisGPT: {
        'Virtual Workshops': [],
        'In-person Workshops': [],
        'Half-day workshops': [],
        'Full-day workshops': [],
        'Facilitation Days': [],
        'Keynote Sessions': [],
        'Retainer Months': [],
        'Local Lodging': [],
        'Airfare - Local Flights': [],
        'Airfare - International Flights': []
    },

};


export const methodologiesOptionsWithIndexes = {
    'Building Resilience With Cognitive Discipline': 24,
    'From Star Player To Star Coach': 25,
    'Managing Our Cognitive Biases': 26,
    'Relationship Management': 27,
    'Simulation Based Learning': 28,
    'Speaking The Language Of Management': 29,
    'THE  PERSUATION  TABLE': 30,
    'Value Communication': 31,
    'Value Orientation': 32,
    'Your Not Moving Slow Enough': 33,
};