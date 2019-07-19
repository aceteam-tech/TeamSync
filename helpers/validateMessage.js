const validateMessage = (parsedMessageBody) => {
    console.log({parsedMessageBody}, !parsedMessageBody.text)

    return parsedMessageBody.text.length > 0
}

export default validateMessage
