const {
  Client,
  IntentsBitField,
  ApplicationCommandOptionType,
} = require("discord.js");
require("dotenv").config();
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  client.guilds.cache.forEach((guild) => {
    // Replace 'Your Command Name' with the name of your command
    client.application.commands
      .create(
        {
          name: "reward",
          description: "reward calcuator for quest",
          options: [
            {
              name: "player-level",
              description: "เลเวลของผู้เล่นทั้งหมดในเควส เช่น 5,5,5,5",
              type: ApplicationCommandOptionType.String,
              required: true,
            },
            {
              name: "dm-ticket",
              description: "true or false",
              type: ApplicationCommandOptionType.Boolean,
              required: true,
            },
            {
              name: "random-player",
              description: "true or false",
              type: ApplicationCommandOptionType.Boolean,
              required: true,
            },
            {
              name: "quest-result",
              description: "true or false",
              type: ApplicationCommandOptionType.Boolean,
              required: true,
            },
          ],
        },
        guild.id
      )
      .then((command) =>
        console.log(`Created command ${command.name} in guild ${guild.name}`)
      )
      .catch(console.error);
  });
});

client.on("messageCreate", (message) => {
  if (message.content === "!test") {
    message.reply(`Hello! ` + message.author.globalName);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand() || interaction.commandName !== "reward") return;
  console.log(
    interaction.options.get("player-level"),
    interaction.options.get("random-player"),
    interaction.options.get("dm-ticket"),
    interaction.options.get("quest-result")
  );
  const player_tier = interaction.options.get("player-level").value;
  let player_gp = await calculatePlayerGP(player_tier);
  let player_rd = await calculatePlayerRD(player_tier);
  let player_ap;
  if (interaction.options.get("quest-result").value == true) {
    player_ap = 2;
  } else {
    player_ap = 1;
    player_rd = 1;
    player_gp = 0;
  }
  let dm_gp = 150;
  let dm_rd = 5;
  let dm_ap = 1;
  if (interaction.options.get("dm-ticket").value == true) {
    dm_gp *= 2;
    dm_rd *= 2;
    dm_ap *= 2;
  }
  if (interaction.options.get("random-player").value == true) {
    dm_rd += 5;
  }
  await interaction.reply(
    `
   > ## **Information**
   > Player Level : ${interaction.options.get("player-level").value}
   > Random Player : ${interaction.options.get("random-player").value}
   > DM use Ticklet : ${interaction.options.get("dm-ticket").value}
   > Quest result : ${interaction.options.get("quest-result").value}

   > **Player Reward**
   > ${player_gp} GP
   > ${player_rd} RD
   > ${player_ap} AP

   > **DM Reward**
   > ${dm_gp} GP
   > ${dm_rd} RD
   > ${dm_ap} AP
    `
  );
});

client.login(
  `MTE5MTcxNzUzODU3MzMyMDI5Mg.GYCfhq.OZDvMunx8-FhHkAlbB5-8BvGQKe9zq_RGh7sHE`
);

function calculatePlayerGP(levelsString) {
  const levels = levelsString.split(",").map((level) => parseInt(level.trim()));

  let result = 0;

  const levelRanges = [
    { min: 1, max: 4, value: 20 },
    { min: 5, max: 10, value: 30 },
    { min: 11, max: 16, value: 40 },
    { min: 17, max: 20, value: 50 },
  ];

  levels.forEach((level) => {
    const range = levelRanges.find(
      (range) => level >= range.min && level <= range.max
    );
    if (range) {
      result += (level * range.value) / levels.length;
    }
  });

  return result;
}

function calculatePlayerRD(levelsString) {
  const levels = levelsString.split(",").map((level) => parseInt(level.trim()));
  const validLevels = levels.filter(
    (level) => !isNaN(level) && level >= 1 && level <= 20
  );
  if (validLevels.length === 0) {
    return 0; // Return 0 if no valid levels are found
  }

  const maxLevel = Math.max(...validLevels);
  let result = 0;

  const levelRanges = [
    { min: 1, max: 4, value: 2 },
    { min: 5, max: 10, value: 4 },
    { min: 11, max: 16, value: 6 },
    { min: 17, max: 20, value: 8 },
  ];

  const range = levelRanges.find(
    (range) => maxLevel >= range.min && maxLevel <= range.max
  );
  if (range) {
    result = range.value;
  }

  return result;
}
