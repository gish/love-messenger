import winston from 'winston'
import { Slack } from 'winston-slack'

const setupLogger = (options = {}) => {
  winston.level = options.level || 'debug'

  if (options.slack && options.slack.apiToken) {
    winston.add(Slack, {
      domain: options.slack.domain,
      apiToken: options.slack.apiToken,
      channel: options.slack.channel,
      username: options.slack.username,
      level: options.slack.level,
      handleExceptions: true
    })
  }

  return winston
}

export default (options) => {
  return setupLogger(options)
}
