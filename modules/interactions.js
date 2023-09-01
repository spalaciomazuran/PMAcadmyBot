module.exports = (client, LogModule) => {
  return {
    async changeRole(member, targetRole, interaction, roles) {
      // You can now use client within this function
      const role = interaction.guild.roles.cache.find(role => role.name === targetRole);
    
      if (role) {
        try { 
          // Remove any existing roles from the roles array
          const existingRoles = member.roles.cache.filter(r => roles.includes(r.name));
          await member.roles.remove(existingRoles);
        
          // Add the new role
          await member.roles.add(role);

          // DM the member the instructions -- including files
          const channel = interaction.guild.channels.cache.find(channel => channel.name === "bienvenida-msg");
          if (channel) {
            const messages = await channel.messages.fetch({ limit: 1 });
            const lastMessage = messages.first(); // get the last message from the channel that containts the welcome message
            if (lastMessage) {
              try {
                const attachmentUrls = lastMessage.attachments.map(item => item.url); // turns the attachment dicts into an array of urls
              
                await member.send({
                  content: lastMessage.content,
                  files: attachmentUrls
                });
              } catch (error) {
                await interaction.reply( {content: "No se han podido enviar las instrucciones, por favor asegurate que tienes los mds de este servidos activados", ephemeral: true} );
                await LogModule.logError(error, "Error sending DM to member", member.user.username);
                console.error("Error sending DM to member:", error);
              }
            }
          }
        
          if (!interaction.replied) {
            await interaction.reply({ content: "Ahora tienes " + role.name, ephemeral: true });
          }
        } catch (error) {
          await interaction.reply( {content: "Ha ocurrido un error, inténtalo más tarde", ephemeral: true} );
          await LogModule.logError(error, "Error assigning role to member", member.user.username);
          console.error("Error assigning role to member:", error);
        }
      } else {
        await interaction.reply( {content: "Ha ocurrido un error, inténtalo más tarde", ephemeral: true} );
        await LogModule.logError({ message: "role is not defined" }, "Role doesn't exist", member.user.username);
        console.error("Role doesn't exist:", error);
      }
    }
  };
};