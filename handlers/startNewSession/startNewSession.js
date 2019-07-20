import fetch from 'node-fetch'
import AWS from 'aws-sdk'
import UsersFeedbackTable from '../../db/UsersFeedbackTable'
import QuestionsTable from '../../db/QuestionsTable'
import TeamsTable from '../../db/TeamsTable'

const sns = new AWS.SNS({ apiVersion: '2010-03-31' })

const TopicArn = process.env.NEW_SESSION_STARTED_TOPIC

export const lambda = async (event) => {
    const {text, challenge} = typeof event.body === 'string' ? JSON.parse(event.body) : event.body

    const params = {
        Message: JSON.stringify({text}),
        TopicArn
    }

    console.log(params)

    await sns.publish(params).promise()

    return defaultResponse(challenge)
}

function defaultResponse(challenge) {
    return {
        statusCode: 200,
        body: JSON.stringify({
            challenge
        })
    }
}