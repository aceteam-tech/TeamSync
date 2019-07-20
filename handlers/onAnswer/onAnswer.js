import fetch from 'node-fetch'
import AWS from 'aws-sdk'
import UsersFeedbackTable from '../../db/UsersFeedbackTable'
import QuestionsTable from '../../db/QuestionsTable'
import TeamsTable from '../../db/TeamsTable'

const sns = new AWS.SNS({apiVersion: '2010-03-31'})

const token = process.env.SLACK_APP_TOKEN
const TopicArn = process.env.USER_FEEDBACK_COMPLETE_TOPIC

export const lambda = async (event) => {
    console.log({ 'event': event })
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body

    const messageText = body.event.text.toLowerCase()

    if (messageText.includes('subscribe')) {
        await fetch('https://w7e8vhpm6d.execute-api.eu-west-2.amazonaws.com/dev/subscribe', { method: 'POST' })
    }
    else {
        const userId = body.event.user
        const text = body.event.text
        const teamId = body.team_id
        // const response = await fetch(`https://slack.com/api/users.profile.get?token=${token}&user=${userId}`)
        // const user = await response.json()

        // console.log({userId: userId, 'user': user})

        const team = await TeamsTable.queryById(teamId)
        let userAnswer = await UsersFeedbackTable.queryBySessionId(team.currentSessionId, userId)
        if (!userAnswer) {
            // TODO: To remove - UsersFeedback entry will be created on scheduled event
            userAnswer = await deprecatedCreateFeedback(team, userId)
            console.log({'userAnswer': userAnswer});
        }
        if (userAnswer.ended) {
            // TODO - can we reply somehow to the user here?
            return feedbackFinished(body.challenge)
        } else {
            const ended = await addUserAnswer(userAnswer, text)
            if(ended){
                const finalFeedback = await UsersFeedbackTable.queryBySessionId(team.currentSessionId, userId)
                await notifyChannel(JSON.stringify(finalFeedback))
            }
        }

        return defaultResponse(body.challenge)
    }
}

async function addUserAnswer(userFeedback, questionAnswer) {
    const answers = [].concat(userFeedback.answers, {
        question: userFeedback.currentQuestion.text,
        answer: questionAnswer,
        last: userFeedback.currentQuestion.last
    })
    const currentQuestion = await QuestionsTable.queryByOrderId((userFeedback.answers.length + 2).toString())
    const ended = !currentQuestion
    await UsersFeedbackTable.addQuestion(userFeedback.id, answers, currentQuestion, ended)

    return ended
}

async function deprecatedCreateFeedback(team, userId){
    const currentQuestion = await QuestionsTable.queryByOrderId('1')
    await UsersFeedbackTable.putMessageAsync(team.currentSessionId, userId, currentQuestion)
    return UsersFeedbackTable.queryBySessionId(team.currentSessionId, userId)
}

async function notifyChannel(text){
    const params = {
        Message: JSON.stringify({text}),
        TopicArn
    }

    await sns.publish(params).promise()
}

function feedbackFinished(challenge){
    return {
        statusCode: 200,
        body: JSON.stringify({
            challenge,
            text: `You've already answered the questions set`
        })
    }
}

function defaultResponse(challenge){
    return {
        statusCode: 200,
        body: JSON.stringify({
            challenge
        })
    }
}