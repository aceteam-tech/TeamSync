import fetch from 'node-fetch'


const token = process.env.SLACK_APP_TOKEN

export const lambda = async ( event ) => {
    console.log({ 'event': event })

    console.log('subscribe')
}
