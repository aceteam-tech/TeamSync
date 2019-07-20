import fetch from 'node-fetch'

const token = process.env.SLACK_APP_TOKEN
const channelId = process.env.CHANNEL_ID

export const lambda = async (event) => {
    const parameters = {
        token: token,
        channel: channelId,
        text: typeof event.body === 'string' ? JSON.parse(event.body).message.text : event.body.message.text,
        username: 'TeamSync'
    }

    const urlParams = Object.keys(parameters).map(k => `${k}=${parameters[k]}`).reduce((a,b) => a+'&'+b)

    await fetch(`https://slack.com/api/chat.postMessage?${urlParams}`,
        {
            method: 'POST'
        })

    return {
        statusCode: 200,
    }
}
