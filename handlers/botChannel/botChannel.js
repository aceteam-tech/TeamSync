import fetch from 'node-fetch'
import { urlParams } from '../../helpers/urlParams'

const token = process.env.SLACK_APP_TOKEN
const appId = process.env.APP_ID

const generalParams = {
    token: token
}

export const lambda = async (event) => {

    const botIdResponse = await fetch(`https://slack.com/api/users.list?${urlParams(generalParams)}`)

    const botIdJson =  await botIdResponse.json()

    const botId = botIdJson.members.find(x=> x.profile.api_app_id === appId)

    const imResponse = await fetch(`https://slack.com/api/im.list?${urlParams(generalParams)}`)

    const imList =  await imResponse.json()

    const channelId = imList.ims.find(x => x.user === botId.id).id;

    console.log(channelId)

    return {
        statusCode: 200,
        body: JSON.stringify({
            channelId
        })
    }
}
