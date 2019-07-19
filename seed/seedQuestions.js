import AWS from 'aws-sdk'
import uuid from 'uuid/v4'

const db = new AWS.DynamoDB.DocumentClient()
const TableName = process.env.QUESTIONS_TABLE

export const lambda = async (event) => {
    const questions = [
        {
            text: 'How do you feel today?',
            order: 1,
            last: false
        },
        {
            text: 'What will you do today?',
            order: 2,
            last: false
        },
        {
            text: 'Do you want to work in pair with somebody today?',
            order: 3,
            last: true
        },
    ]

    await Promise.all(questions.map(async (question) => {
        const params = {
            TableName,
            Item: {
                id: question.order.toString(),
                ...question
            }
        }
        return db.put(params).promise()
    }))

    return 'Questions has been seeded ;)'
}