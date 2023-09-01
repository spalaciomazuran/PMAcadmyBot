module.exports = (client) => {
  return {
    async logError(error, reason, user) {
      const chan = client.channels.cache.get("1147146158196658277");
      chan.send(`\`\`\`\nErrorName: ${error.name}\nErrorMsg: ${error.message}\nErrorStack: ${error.stack}\n\nReason: ${reason}\nUser: ${user}\n\`\`\``);
    }
  };
};