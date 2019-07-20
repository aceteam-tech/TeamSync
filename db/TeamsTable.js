import AWS from 'aws-sdk'
import uuid from 'uuid/v4'

const TableName = process.env.TEAMS_TABLE
const db = new AWS.DynamoDB.DocumentClient()

export default class TeamsTable {
    static async putTeamAsync(){

        const params = {
            TableName,
            Item: {
                id: uuid(),
                users: [],
                currentSessionId: 0
            }
        }
        return db.put(params).promise()
    }

    // static async updateTeamAsync(id, userId){
    //     const updateParams = {
    //         TableName,
    //         Key: {
    //             id
    //         },
    //         UpdateExpression: 'set email = :email',
    //         ExpressionAttributeValues: {
    //             ':email' : email
    //         }
    //     }
    //
    //     return db.update(updateParams).promise()
    // }
}
