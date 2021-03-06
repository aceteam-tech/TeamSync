import AWS from 'aws-sdk'
import uuid from 'uuid/v4'

const db = new AWS.DynamoDB.DocumentClient()

const TableName = process.env.TEAMS_TABLE

export default class TeamsTable {
    static async putTeam(id, users = [], currentSessionId = uuid()){
        const params = {
            TableName,
            Item: {
                id,
                currentSessionId,
                users
            }
        }
        return db.put(params).promise()
    }

    static async queryById(teamId){
        const queryParams = {
            TableName,
            KeyConditionExpression: 'id = :id',
            ExpressionAttributeValues: {
                ':id': teamId
            }
        }
        return (await db.query(queryParams).promise()).Items[0]
    }

    // @TODO to update
    static async assignUser(teamId, userId){
        const queryParams = {
            TableName,
            KeyConditionExpression: 'id = :id',
            ExpressionAttributeValues: {
                ':id': teamId
            }
        }
        return (await db.query(queryParams).promise()).Items[0]
    }

    // @TODO to update
    static async removeUser(teamId, userId){
        const queryParams = {
            TableName,
            KeyConditionExpression: 'id = :id',
            ExpressionAttributeValues: {
                ':id': teamId
            }
        }
        return (await db.query(queryParams).promise()).Items[0]
    }
}
