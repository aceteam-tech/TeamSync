import AWS from 'aws-sdk'
import fetch from 'node-fetch'
import TeamsTable from '../../db/TeamsTable'

const token = process.env.SLACK_APP_TOKEN
const db = new AWS.DynamoDB.DocumentClient({'region': 'eu-west-2'})
const TableName = process.env.TeamsTable

export const lambda = async ( event ) => {
    console.log({ 'event': event })

    console.log('subscribe')

    // const userId = JSON.parse(event.body).event.user
    // const response = await fetch(`https://slack.com/api/users.profile.get?token=${token}&user=${userId}`)
    // const user = await response.json()

    // console.log({user})

    await TeamsTable.putTeam()

    // await new Promise((res, rej)=> {
    //     const params = {
    //         TableName,
    //         Item: {
    //             id: 0
    //         }
    //     }
    //     return db.put(params).promise()
    // })
}
