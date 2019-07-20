import TeamsTable from '../db/TeamsTable'

export const lambda = async (event) => {
    await TeamsTable.putTeam('1')

    return 'A team has been seeded ;)'
}