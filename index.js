const a = require("./alive.js");

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

// Overwritable roles
const roles = ["1º ESO", "2º ESO", "3º ESO", "4º ESO", "1º BACH", "2º BACH", "IB"];

// Modules
const LogModule = require("./modules/log.js")(client);
const InteractionsModule = require("./modules/interactions.js")(client, LogModule);
const BuilderModule = require("./modules/builder.js")(client);

// Ready function - creates role dropdown menu
client.on("ready", () => {
  BuilderModule.buildRoleSelectionMenu(ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, roles);
  console.log("Client ready for action");
});

// Commands
client.on("messageCreate", msg => {
  if (msg.content.includes("<@1146606897751932969>")) {
    msg.reply({content: "No me toques los cojones " + msg.author.username});
  }
});

// Role func
client.on("interactionCreate", async interaction => {
  if (!interaction.isStringSelectMenu()) return;
  
  if (interaction.customId === "elector-roles") {
    await InteractionsModule.changeRole(interaction.member, interaction.values[0], interaction, roles);
  }
});

// Global error handler
client.on("error", (error) => {
  console.error("An error occurred:", error);
  LogModule.logError(error, "Global error");
});

// Login
client.login(process.env.TOKEN);