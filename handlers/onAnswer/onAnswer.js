import fetch from 'node-fetch'

const token = process.env.SLACK_APP_TOKEN

export const lambda = async ( event ) => {
    console.log({ 'event': event })

    const messageText = JSON.parse(event.body).event.text.toLowerCase()

    if (messageText.includes('subscribe')) {
        await fetch(' https://w7e8vhpm6d.execute-api.eu-west-2.amazonaws.com/dev/subscribe', { method: 'POST' })
    }
    else {
        const userId = JSON.parse(event.body).event.user
        const response = await fetch(`https://slack.com/api/users.profile.get?token=${token}&user=${userId}`)
        const user = await response.json()

        await fetch(' https://w7e8vhpm6d.execute-api.eu-west-2.amazonaws.com/dev/messageUser', { method: 'POST' })

        return {
            statusCode: 200,
            body: JSON.stringify({
                challenge: JSON.parse(event.body).challenge,
                user
            })
        }
    }
}
