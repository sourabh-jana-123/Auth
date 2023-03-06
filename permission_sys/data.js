const ROLE = {
    ADMIN: 'admin',
    BASIC: 'basic'
}

module.exports = {
    ROLE: ROLE,
    users: [
        { id: 1, name: 'Sourabh', role: ROLE.ADMIN },
        { id: 2, name: 'Abhishek', role: ROLE.BASIC },
        { id: 3, name: 'Shivam', role: ROLE.BASIC }
    ],
    projects: [
        { id: 1, name: "Sourabh's Project", userId: 1 },
        { id: 2, name: "Abhishek's Project", userId: 2 },
        { id: 3, name: "Shivam's project", userId: 3 } 
    ]
}