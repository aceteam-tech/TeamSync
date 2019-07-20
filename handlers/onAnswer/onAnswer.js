import fetch from 'node-fetch'
import UsersFeedbackTable from '../../db/UsersFeedbackTable'
import QuestionsTable from '../../db/QuestionsTable'
import TeamsTable from '../../db/TeamsTable'


const token = process.env.SLACK_APP_TOKEN

export const lambda = async ( event ) => {
    console.log({ 'event': event })
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body

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
                await notifyChannel(JSON.stringify(finalFeedback))
            }
        }

        return defaultResponse(body.challenge)
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
    await UsersFeedbackTable.addQuestion(userFeedback.id, answers, currentQuestion, ended)

    return ended
}

async function deprecatedCreateFeedback( team, userId ) {
    const currentQuestion = await QuestionsTable.queryByOrderId('1')
    await UsersFeedbackTable.putMessageAsync(team.currentSessionId, userId, currentQuestion)
    return UsersFeedbackTable.queryBySessionId(team.currentSessionId, userId)
}

async function notifyChannel( text ) {
    await fetch('https://dcs3ah23lk.execute-api.eu-west-2.amazonaws.com/dev/messageChannel',
        {
            method: 'POST',
            body: JSON.stringify({
                message: {
                    text
                }
            })
        })
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
