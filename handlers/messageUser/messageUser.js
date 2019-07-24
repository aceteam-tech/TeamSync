import fetch from 'node-fetch'
import { urlParams } from '../../helpers/urlParams'

const token = process.env.SLACK_APP_TOKEN

export const lambda = async (event) => {
    const {text, attachments} = typeof event.Records[0].Sns.Message === 'string' ?
        JSON.parse(event.Records[0].Sns.Message) :
        event.Records[0].Sns.Message

    const channelIdResponse = await fetch(`https://36lh0kji86.execute-api.eu-west-2.amazonaws.com/dev/botChannel`)

    const {channelId} = await channelIdResponse.json()

    const messageParameters = {
        token: token,
        channel: channelId,
        text: text,
        attachments: JSON.stringify(attachments)
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
