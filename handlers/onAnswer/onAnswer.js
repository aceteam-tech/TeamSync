import fetch from 'node-fetch'
import AWS from 'aws-sdk'
import UsersFeedbackTable from '../../db/UsersFeedbackTable'
import QuestionsTable from '../../db/QuestionsTable'
import TeamsTable from '../../db/TeamsTable'

const sns = new AWS.SNS({ apiVersion: '2010-03-31' })

const token = process.env.SLACK_APP_TOKEN
const TopicArn = process.env.USER_FEEDBACK_COMPLETE_TOPIC

export const lambda = async ( event ) => {
    console.log({ 'event': event })
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body

    if(body.type === 'url_verification'){
        return defaultResponse(body.challenge)
    }

    const userId = body.event.user
    const text = body.event.text
    const teamId = body.team_id

    if (text.toLowerCase().includes('subscribe')) {
        await subscribe(teamId, userId)

        // await fetch('https://w7e8vhpm6d.execute-api.eu-west-2.amazonaws.com/dev/subscribe', { method: 'POST', body: {} })
    }
    else {

        const team = await TeamsTable.queryById(teamId)
        let userAnswer = await UsersFeedbackTable.queryBySessionId(team.currentSessionId, userId)
        if (!userAnswer) {
            // TODO: To remove - UsersFeedback entry will be created on scheduled event
            userAnswer = await deprecatedCreateFeedback(team, userId)
            console.log({ 'userAnswer': userAnswer })
        }
        if (userAnswer.last) {
            // TODO - can we reply somehow to the user here?
            return feedbackFinished(body.challenge)
        }
        else {
            const ended = await addUserAnswer(userAnswer, text)
            if (ended) {
                const finalFeedback = await UsersFeedbackTable.queryBySessionId(team.currentSessionId, userId)

                const attachments = finalFeedback.answers.map(ans =>  {
                        return {
                            fallback: ans.question,
                            title: ans.question,
                            text: ans.answer,
                            color: "#36a64f"
                        }
                })

                const text = 'Daily Planning'

                await notifyChannel(text, userId, JSON.stringify(attachments))
            }
            return defaultResponse(body.challenge)
        }
    }
}

async function addUserAnswer( userFeedback, questionAnswer ) {
    const answers = [].concat(userFeedback.answers, {
        question: userFeedback.currentQuestion.text,
        answer: questionAnswer,
        last: userFeedback.currentQuestion.last
    })
    const currentQuestion = await QuestionsTable.queryByOrderId((userFeedback.answers.length + 2).toString())
    const ended = !currentQuestion
    if(!ended){
        await UsersFeedbackTable.addQuestion(userFeedback.id, answers, currentQuestion, ended)
    }

    return ended
}

async function deprecatedCreateFeedback( team, userId ) {
    const currentQuestion = await QuestionsTable.queryByOrderId('1')
    await UsersFeedbackTable.putMessageAsync(team.currentSessionId, userId, currentQuestion)
    return UsersFeedbackTable.queryBySessionId(team.currentSessionId, userId)
}

async function notifyChannel(text, userId, attachments){

    const params = {
        Message: JSON.stringify({text, userId, attachments}),
        TopicArn
    }

    await sns.publish(params).promise()
}

function feedbackFinished( challenge ) {
    return {
        statusCode: 200,
        body: JSON.stringify({
            challenge,
            text: `You've already answered the questions set`
        })
    }
}

function defaultResponse( challenge ) {
    return {
        statusCode: 200,
        body: JSON.stringify({
            challenge
        })
    }
}

async function subscribe( id, userId ) {
    console.log({id})

    const doesTeamExist = await TeamsTable.queryById(id)

    console.log({ doesTeamExist })

    if (!doesTeamExist) {
        await TeamsTable.putTeam(id, [userId])
    }
    else {
        console.log('teamexists')
    }

}
