import fetch from 'node-fetch'
import { urlParams } from '../../helpers/urlParams'

const token = process.env.SLACK_APP_TOKEN

export const lambda = async (event) => {

    const botParams = {
        token: token,
        bot: 'BLL7LGVRN'
    }

    const botInfoResponse = await fetch(`https://slack.com/api/bots.info?${urlParams(botParams)}`,
        {
            method: 'POST'
        })

    const botUserId =  await botInfoResponse.json()

    const imParams = {
        token: token
    }

    const imResponse = await fetch(`https://slack.com/api/im.list?${urlParams(imParams)}`,
        {
            method: 'POST'
        })

    const imList =  await imResponse.json()

    const channelId = imList.ims.find(x => x.user === botUserId.bot.user_id).id;

    console.log(channelId)

    return {
        statusCode: 200,
        body: JSON.stringify({
            channelId
        })
    }
}
