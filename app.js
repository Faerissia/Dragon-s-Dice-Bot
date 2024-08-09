const {
  Client,
  IntentsBitField,
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");
require("dotenv").config();
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildVoiceStates,
  ],
});

// Target voice channel ID
const targetVoiceChannelId = "1201857462177632276";
const PrivateRoom = "1202308314898374676";

client.once("ready", () => {
  console.log("Bot is ready!");
});

client.on("voiceStateUpdate", async (oldState, newState) => {
  const newUserChannel = newState.channel;
  const oldUserChannel = oldState.channel;
  const user = await client.users.fetch(newState.id);
  //create adventure
  if (newUserChannel && newUserChannel.id === targetVoiceChannelId) {
    const guild = newState.guild;
    const roleId = "1266364589755465795";

    const permissionOverwrites = [
      {
        id: guild.roles.everyone.id,
        deny: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: roleId,
        allow: [PermissionFlagsBits.ViewChannel],
      },
    ];

    const category = await guild.channels.create({
      name: "Adventure Room",
      type: ChannelType.GuildCategory,
      permissionOverwrites: permissionOverwrites,
    });

    const md_scene = await guild.channels.create({
      name: `DM-SCENE`,
      type: ChannelType.GuildText,
      parent: category,
      permissionOverwrites: permissionOverwrites,
    });

    const text = await guild.channels.create({
      name: `Dice Room`,
      type: ChannelType.GuildText,
      parent: category,
      permissionOverwrites: permissionOverwrites,
    });

    const chat = await guild.channels.create({
      name: `Chat Room`,
      type: ChannelType.GuildText,
      parent: category,
      permissionOverwrites: permissionOverwrites,
    });

    const note = await guild.channels.create({
      name: `Note Room`,
      type: ChannelType.GuildText,
      parent: category,
      permissionOverwrites: permissionOverwrites,
    });

    const Music = await guild.channels.create({
      name: `Music Room`,
      type: ChannelType.GuildText,
      parent: category,
      permissionOverwrites: permissionOverwrites,
    });

    const voice = await guild.channels.create({
      name: `Voice Room`,
      type: ChannelType.GuildVoice,
      parent: category,
      permissionOverwrites: permissionOverwrites,
    });

    try {
      await newState.setChannel(voice);
    } catch (error) {
      if (oldUserChannel && oldUserChannel.id !== targetVoiceChannelId) {
        const category = oldUserChannel.parent;
        const all = oldUserChannel.parent.children.cache;

        if (
          category &&
          category.name === "Adventure Room" &&
          oldUserChannel.members.size === 0
        ) {
          all.forEach((channel) => {
            channel.delete();
          });
          category.delete();
        }
      }
    }
  }
  //create private
  if (newUserChannel && newUserChannel.id === PrivateRoom) {
    const guild = newState.guild;

    const voice = await guild.channels.create({
      name: `Private Room`,
      type: ChannelType.GuildVoice,
      parent: newState.channel.parent,
    });

    // await voice.setUserLimit(2);

    try {
      await newState.setChannel(voice);
    } catch (error) {
      if (oldUserChannel && oldUserChannel.id !== PrivateRoom) {
        const category = oldUserChannel.parent;
        const all = oldUserChannel.parent.children.cache;

        if (
          category &&
          category.name === "Private Room" &&
          oldUserChannel.members.size === 0
        ) {
          all.forEach((channel) => {
            channel.delete();
          });
          category.delete();
        }
      }
    }
  }
  //remove adventure room
  if (oldUserChannel && oldUserChannel.id !== targetVoiceChannelId) {
    const category = oldUserChannel.parent;
    const all = oldUserChannel.parent.children.cache;

    if (
      category &&
      category.name === "Adventure Room" &&
      oldUserChannel.members.size === 0
    ) {
      all.forEach((channel) => {
        channel.delete();
      });
      category.delete();
    }
  }

  //remove private
  if (oldUserChannel && oldUserChannel.id !== targetVoiceChannelId) {
    const category = oldUserChannel.parent;
    const voicePrivateChannel = oldState.channel;

    if (
      category &&
      category.name === "-----Private Room-----" &&
      voicePrivateChannel.name === "Private Room" &&
      oldUserChannel.members.size === 0
    ) {
      await voicePrivateChannel.delete();
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
