import fetch from 'node-fetch'
import AWS from 'aws-sdk'
import UsersFeedbackTable from '../../db/UsersFeedbackTable'
import QuestionsTable from '../../db/QuestionsTable'
import TeamsTable from '../../db/TeamsTable'

const sns = new AWS.SNS({ apiVersion: '2010-03-31' })

const TopicArn = process.env.NEW_SESSION_STARTED_TOPIC

export const lambda = async (event) => {
    console.log({ 'event': event })

    return defaultResponse(body.challenge)
}

function defaultResponse(challenge) {
    return {
        statusCode: 200,
        body: JSON.stringify({
            challenge
        })
    }
}