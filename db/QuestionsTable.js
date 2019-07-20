import AWS from 'aws-sdk'

const db = new AWS.DynamoDB.DocumentClient()

const TableName = process.env.QUESTIONS_TABLE

export default class QuestionsTable {
    static async queryByOrderId(orderId){
        const queryParams = {
            TableName,
            KeyConditionExpression: 'id = :orderId',
            ExpressionAttributeValues: {
                ':orderId': orderId
            }
        }
        return (await db.query(queryParams).promise()).Items[0]
    }
}
