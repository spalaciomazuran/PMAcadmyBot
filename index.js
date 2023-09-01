require("./alive.js");

const { Client, GatewayIntentBits, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
  ]
});

// Menu elegir rol (function que se ejecuta cuando el bot está listo)
client.on("ready", () => {
  console.log("Logged in as ${client.user.tag}!");

  const menuRoles = new StringSelectMenuBuilder()
    .setCustomId("elector-roles")
    .setPlaceholder("Elige tu rol")
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel("1º ESO")
        .setValue("1º ESO"),
      new StringSelectMenuOptionBuilder()
        .setLabel("2º ESO")
        .setValue("2º ESO"),
      new StringSelectMenuOptionBuilder()
        .setLabel("3º ESO")
        .setValue("3º ESO"),
      new StringSelectMenuOptionBuilder()
        .setLabel("4º ESO")
        .setValue("4º ESO"),
      new StringSelectMenuOptionBuilder()
        .setLabel("1º BACH")
        .setValue("1º BACH"),
      new StringSelectMenuOptionBuilder()
        .setLabel("2º BACH")
        .setValue("2º BACH"),
      new StringSelectMenuOptionBuilder()
        .setLabel("IB")
        .setValue("IB"),
    );

  const menuRolesRow = new ActionRowBuilder()
    .addComponents(menuRoles);

  const chan = client.channels.cache.get("1146952688135843971");

  chan.messages.fetch({ limit: 10 })
    .then(messages => {

      const botMessages = messages.filter(msg => msg.author.bot);

      chan.bulkDelete(botMessages)
        .then(() => {
          chan.send({
            content: "",
            components: [menuRolesRow]
          });
        });
    });
});

// Mensajes
client.on("messageCreate", msg => {
  if (msg.content.includes("<@1146606897751932969>")) {
    msg.react("🖕");
    msg.reply({content: "Hola, no me toques los cojones " + msg.author.username});
  }
});

// Functionalidad menu elegir rol
const roles = ["1º ESO", "2º ESO", "3º ESO", "4º ESO", "1º BACH", "2º BACH", "IB"];

client.on('interactionCreate', async interaction => {
  if (!interaction.isStringSelectMenu()) return;
  
  if (interaction.customId === 'elector-roles') {
    const selectedOption = interaction.values[0];
    
    const role = interaction.guild.roles.cache.find(role => role.name === selectedOption);
    
    if (role) {
      try {
        const member = interaction.member;
        // Remove any existing roles from the roles array
        const existingRoles = member.roles.cache.filter(r => roles.includes(r.name));
        await member.roles.remove(existingRoles);
        // Add the new role
        await member.roles.add(role);

        // DM the user the instructions -- including files
        const channel = interaction.guild.channels.cache.find(channel => channel.name === "bienvenida-msg");
        if (channel) {
          const messages = await channel.messages.fetch({ limit: 1 });
          const lastMessage = messages.first();
          if (lastMessage) {
            try {
              const attachmentUrls = lastMessage.attachments.map(item => item.url);
              
              await member.send({
                content: lastMessage.content,
                files: attachmentUrls
              });
            } catch (error) {
              console.error('Error sending DM to user:', error);
            }
          }
        }
        
        await interaction.reply( {content: "Ahora tienes " + role.name, ephemeral: true} );
      } catch (error) {
        await interaction.reply( {content: "Ha ocurrido un error, inténtalo más tarde", ephemeral: true} );
      }
    } else {
      await interaction.reply( {content: "Ha ocurrido un error, inténtalo más tarde", ephemeral: true} );
    }
  }
});

client.login(process.env.TOKEN);
