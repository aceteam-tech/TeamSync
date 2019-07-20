import fetch from 'node-fetch'
import { urlParams } from '../../helpers/urlParams'

const token = process.env.SLACK_APP_TOKEN

export const lambda = async (event) => {
    const eventBody = typeof event.body === 'string' ? JSON.parse(event.body) : event.body

    const channelIdResponse = await fetch(`https://dcs3ah23lk.execute-api.eu-west-2.amazonaws.com/dev/botChannel`)

    const {channelId} = await channelIdResponse.json()

    const messageParameters = {
        token: token,
        channel: channelId,
        text: 'Send from Lambda!'
    }

    const response = await fetch(`https://slack.com/api/chat.postMessage?${urlParams(messageParameters)}`,
        {
            method: 'POST'
        })
    const jsonResponse =  await response.json()

    return {
        statusCode: 200,
        body: {
            jsonResponse
        }
    }
}
