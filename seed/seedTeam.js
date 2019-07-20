import TeamsTable from '../db/TeamsTable'

export const lambda = async (event) => {
    await TeamsTable.putTeam('T93SHU600')

    return 'A team has been seeded ;)'
}