import fetch from 'node-fetch'

const token = process.env.SLACK_APP_TOKEN

export const lambda = async (event) => {
    const user = 'GL8PG0K34'

    const parameters = {
        token: token,
        channel: user,
        text: typeof event.body === 'string' ? JSON.stringify(event.body).message.text : event.body.message.text,
        username: 'TeamSync'
    }

    const urlParams = Object.keys(parameters).map(k => `${k}=${parameters[k]}`).reduce((a,b) => a+'&'+b)

    const response = await fetch(`https://slack.com/api/chat.postMessage?${urlParams}`,
        {
            method: 'POST'
        })
    const jsonResponse =  await response.json()

    return {
        statusCode: 200,
        body: JSON.stringify({
            parameters: urlParams,
            messageSend: true,
            slackResponse: jsonResponse
        })
    }
}