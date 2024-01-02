const { REST, Routes } = require("discord.js");
require("dotenv").config();

const commands = [
  {
    name: "hey",
    description: "Replies with hey!",
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("resgistering slash command...");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );
    console.log("slash commands were registered successfully!");
  } catch (error) {
    console.log(`There was an error : ${error}`);
  }
})();
