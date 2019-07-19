export const lambda = async (event) => {
    console.log({'event': event});

    return {
        statusCode: 200,
        body: JSON.stringify(event)
    }
}