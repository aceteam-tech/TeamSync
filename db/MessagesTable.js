import AWS from 'aws-sdk'
import uuid from 'uuid/v4'

const db = new AWS.DynamoDB.DocumentClient()

const TableName = process.env.MESSAGES_TABLE

export default class ProfilesTable {
    static async putProfileAsync(sessionId, name, email, ended){
        const params = {
            TableName,
            Item: {
                id: uuid(),
                name,
                teams:[],
                date: new Date()
            }
        }
        return db.put(params).promise()
    }

    static async queryByEmail(email){
        const queryParams = {
            TableName,
            IndexName: 'gsi_email',
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': email
            }
        }
        return (await db.query(queryParams).promise()).Items[0]
    }

    static async updateEmail(id, email){
        const updateParams = {
            TableName,
            Key: {
                id
            },
            UpdateExpression: 'set email = :email',
            ExpressionAttributeValues: {
                ':email' : email
            }
        }

        return db.update(updateParams).promise()
    }
}
