import fetch from 'node-fetch'

const token = process.env.SLACK_APP_TOKEN

export const lambda = async (event) => {
    console.log({'event': event});

    const userId = JSON.parse(event.body).event.user

    const response = await fetch(`https://slack.com/api/users.profile.get?token=${token}&user=${userId}`)
    const user = await response.json()

    console.log({'user': user})

    return {
        statusCode: 200,
        body: JSON.stringify({
            challenge: JSON.parse(event.body).challenge,
            user
        })
    }
}