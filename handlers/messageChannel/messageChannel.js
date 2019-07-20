import fetch from 'node-fetch'

const token = process.env.SLACK_APP_TOKEN
const channelId = process.env.CHANNEL_ID

export const lambda = async (event) => {
    const { text } = typeof event.Records[0].Sns.Message === 'string' ?
        JSON.parse(event.Records[0].Sns.Message) :
        event.Records[0].Sns.Message

    const parameters = {
        token: token,
        channel: channelId,
        text,
        username: 'TeamSync'
    }

    console.log({'parameters': parameters});

    const urlParams = Object.keys(parameters).map(k => `${k}=${parameters[k]}`).reduce((a,b) => a+'&'+b)

    const response = await fetch(`https://slack.com/api/chat.postMessage?${urlParams}`,
        {
            method: 'POST'
        })

    const resolved = await response.json()
    console.log({'resolved': resolved});

    return {
        statusCode: 200,
    }
}
