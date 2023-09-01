module.exports = (client) => {
  return {
    async buildRoleSelectionMenu(ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, roles) {
      // You can now use client within this function
      const roleDropDown = new StringSelectMenuBuilder()
        .setCustomId("elector-roles")
        .setPlaceholder("Elige tu rol");

      roles.forEach(role => {
          roleDropDown.addOptions(
              new StringSelectMenuOptionBuilder().setLabel(role).setValue(role)
          );
      });

      const roleDropDownRow = new ActionRowBuilder().addComponents(roleDropDown);

      const chan = client.channels.cache.get("1146952688135843971");

      chan.messages.fetch({ limit: 10 })
        .then(messages => {

          const botMessages = messages.filter(msg => msg.author.bot);

          chan.bulkDelete(botMessages)
            .then(() => {
              chan.send({
                content: "",
                components: [roleDropDownRow]
              });
            });
        });
    }
  };
};