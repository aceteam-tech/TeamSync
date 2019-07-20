import AWS from 'aws-sdk'
import uuid from 'uuid/v4'

const db = new AWS.DynamoDB.DocumentClient()

const TableName = process.env.USERS_FEEDBACK_TABLE

export default class UsersFeedbackTable {
    static async putMessageAsync(sessionId, userId, currentQuestion, ended = false){
        const params = {
            TableName,
            Item: {
                id: uuid(),
                sessionId,
                userId,
                answers: [],
                currentQuestion,
                ended,
                date: Date.now()
            }
        }
        return db.put(params).promise()
    }

    static async queryBySessionId(sessionId, userId){
        const queryParams = {
            TableName,
            IndexName: 'gsi_session',
            KeyConditionExpression: 'sessionId = :sessionId',
            FilterExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':sessionId': sessionId,
                ':userId': userId
            }
        }
        return (await db.query(queryParams).promise()).Items[0]
    }

    static async addQuestion(messageId, answers, currentQuestion = {}, ended = false){
        const updateParams = {
            TableName,
            Key: {
                id: messageId
            },
            UpdateExpression: 'SET answers = :answers, currentQuestion = :currentQuestion, ended = :ended',
            ExpressionAttributeValues: {
                ':answers' : answers,
                ':currentQuestion' : currentQuestion,
                ':ended' : ended
            }
        }

        return db.update(updateParams).promise()
    }
}
