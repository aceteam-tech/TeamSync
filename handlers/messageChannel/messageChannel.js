import fetch from 'node-fetch'

const token = process.env.SLACK_APP_TOKEN
const channelId = process.env.CHANNEL_ID

export const lambda = async (event) => {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body

    const response = await fetch(`https://slack.com/api/users.profile.get?token=${token}&user=${JSON.parse(body.message.text).userId}`)
    const {profile} = await response.json()
    const {real_name, image_original} = profile

    const parameters = {
        token: token,
        channel: channelId,
        text: body.message.text,
        username: real_name,
        icon_url: image_original
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
