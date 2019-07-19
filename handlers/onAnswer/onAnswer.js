import fetch from 'node-fetch'
import validateMessage from '../../helpers/validateMessage'


const token = process.env.SLACK_APP_TOKEN

export const lambda = async ( event ) => {
    console.log({ 'event': event })

    if (!validateMessage(JSON.parse(event.body))) {
        return console.log('NO MESSAGE TEXT')
    }

    const userId = JSON.parse(event.body).event.user

    const response = await fetch(`https://slack.com/api/users.profile.get?token=${token}&user=${userId}`)
    const user = await response.json()

    console.log({userId: userId, 'user': user})

    await fetch('https://dcs3ah23lk.execute-api.eu-west-2.amazonaws.com/dev/messageUser', {method: 'POST'})

    return {
        statusCode: 200,
        body: JSON.stringify({
            challenge: JSON.parse(event.body).challenge,
            user
        })
    }
}
