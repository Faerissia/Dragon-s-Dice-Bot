const {
  Client,
  IntentsBitField,
  ApplicationCommandOptionType,
} = require("discord.js");
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});
require("dotenv").config();

client.once("ready", () => {
  console.log("Bot is ready!");
});

client.on("voiceStateUpdate", async (oldState, newState) => {
  const newUserChannel = newState.channel;
  const oldUserChannel = oldState.channel;
  console.log(oldState, newState);

  if (newUserChannel && newUserChannel.id === 1027855478040055861) {
    const guild = newState.guild;
    const category = await guild.channels.create("New Category", {
      type: "category",
    });

    const voiceChannel = await guild.channels.create("New Voice Channel", {
      type: "voice",
      parent: category,
    });

    const textChannel = await guild.channels.create("New Text Channel", {
      type: "text",
      parent: category,
    });

    // Move the user to the newly created voice channel
    newState.setChannel(voiceChannel);
  }

  // Clean up the category if no one is in the voice channel
  if (oldUserChannel && oldUserChannel.id !== 1027855478040055861) {
    const category = oldUserChannel.parent;
    if (
      category &&
      category.name === "New Category" &&
      oldUserChannel.members.size === 0
    ) {
      category.children.forEach((child) => child.delete());
      category.delete();
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
