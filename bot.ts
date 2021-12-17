import {
  Client,
  Collector,
  ColorUtil,
  Embed,
  event,
  Guild,
  Intents,
  Interaction,
  InteractionResponseType,
  Member,
  MessageAttachment,
  MessageComponentData,
  MessageComponentOption,
  MessageComponentType,
  // Reaction,
  slash,
  SlashCommandInteraction,
  // User,
} from "./deps.ts";
import { commandPartials } from "./command_partials.ts";
import * as constants from "./constants.ts";
import db from "./db.ts";
import type { GuildConfig, ValorantRankInfo } from "./types.ts";

const dbCol = db.collection<GuildConfig>("guild_config");

class DiscordBot extends Client {
  @event()
  async ready() {
    db.name && console.log("Connected to MongoDB");

    const guildConfigArr = await dbCol.find({}, { noCursorTimeout: false })
      .toArray();

    guildConfigArr.forEach((guildConfig) => {
      commandPartials.forEach((commandPartial) => {
        this.interactions.commands.create(commandPartial, guildConfig.guildId)
          .then((cmd) => console.log(`Slash command ${cmd.name} created`))
          .catch(() => console.log(`Failed to create a command!`));
      });
    });

    console.log("Bot is ready");
  }

  @event()
  async guildCreate(guild: Guild) {
    const doc = await dbCol.findOne(
      { guildId: guild.id },
      { noCursorTimeout: false },
    );

    if (doc == null) {
      await dbCol.insertOne({
        guildId: guild.id,
        primaryRoleIds: {
          verified: "",
          unverified: "",
          bot: "",
        },
        secondaryRoleIds: {},
        channelIds: {
          welcome: "",
          admin: "",
          audit: "",
        },
      });

      console.log(`Joined new guild ${guild.name}`);
    }
  }

  @event()
  async guildMemberAdd(member: Member) {
    const doc = await dbCol.findOne(
      { guildId: member.guild.id },
      { noCursorTimeout: false },
    );

    if (doc != null) {
      // const unverifiedRole = await member.guild.roles.get(
      //   doc.primaryRoleIds.unverified,
      // );

      const defaultRole = await member.guild.roles.get(
        doc.primaryRoleIds.verified,
      );

      const botRole = await member.guild.roles.get(doc.primaryRoleIds.bot);
      const welcomeCh = await member.guild.channels.get(doc.channelIds.welcome);

      if (member.user.bot && botRole != null) {
        await member.roles.add(botRole);
      } else {
        // if (unverifiedRole != null && defaultRole != null) {
        //   await member.roles.add(unverifiedRole);

        //   const embed = new Embed({
        //     title: "Please read below",
        //     description:
        //       `To unlock the server, please react to this message with ☑️. Enjoy your stay ${member.user.mention}!\n\n*Please rejoin the server if verification does not work.*`,
        //     thumbnail: { url: member.user.avatarURL() },
        //     footer: {
        //       text: member.guild.name!,
        //       icon_url: member.guild.iconURL(),
        //     },
        //     color: ColorUtil.resolveRGB(constants.colorsArr["bionic"]),
        //   });

        //   if (welcomeCh != null && welcomeCh.isGuildText()) {
        //     await welcomeCh.send({ embed: embed });

        //     const collector = new Collector({
        //       event: "messageReactionAdd",
        //       filter: (_, user: User) => user.id === member.id,
        //       deinitOnEnd: true,
        //       max: 1,
        //     });

        //     collector.init(this);
        //     collector.collect();

        //     collector.on("collect", async (reaction: Reaction, _) => {
        //       if (reaction.emoji.name === "☑️") {
        //         await member.roles.add(defaultRole!);
        //         await member.roles.remove(unverifiedRole!);

        //         const userDm = await member.user.createDM();

        //         await userDm.send(
        //           "You have been successfully verified! Use `/roles` to get your preferred roles. Feel free to contact an admin if you need any help.",
        //         );

        //         console.log(`New member ${member.user.tag} has been verified`);
        //         collector.end();
        //       }
        //     });
        //   }
        // } else {
          if (defaultRole != null) {
            await member.roles.add(defaultRole);
          }

          const embed = new Embed({
            title: "Welcome to Bionic!",
            description: `Enjoy your stay ${member.user.mention}!\n\n`,
            thumbnail: { url: member.user.avatarURL() },
            footer: {
              text: member.guild.name!,
              icon_url: member.guild.iconURL(),
            },
            color: ColorUtil.resolveRGB(constants.colorsArr["bionic"]),
          });

          if (welcomeCh != null && welcomeCh.isGuildText()) {
            await welcomeCh.send({ embed: embed });
          }
        // }
      }
    }
  }

  @slash()
  async ping(i: SlashCommandInteraction) {
    await i.reply(`🏓 ${i.client.gateway.ping.toString()}ms`);
  }

  @slash()
  async help(i: SlashCommandInteraction) {
    const owner = await i.guild?.members.fetch(constants.ownerId);

    const embed = new Embed({
      title: "Hello I am the new BionicBot",
      description:
        "`.commands` are now gone and I only work using the new `/commands`. It ok doe they ez to use! \n\nJust press `/` and you can browse through all my commands and their descriptions.",
      footer: {
        text: `Bot made by: ${owner?.user.tag}`,
        icon_url: owner?.user.avatarURL(),
      },
      thumbnail: { url: this.user?.avatarURL() },
      color: ColorUtil.resolveRGB(constants.colorsArr["bionic"]),
    });

    await i.reply({ embeds: [embed] });
  }

  @slash()
  async cls(i: SlashCommandInteraction) {
    const hasPerms = i.member?.permissions.has("MANAGE_GUILD");

    if (!hasPerms) {
      await i.reply("You don't have the permission to use this command", {
        ephemeral: true,
      });
    } else {
      if (i.data) {
        const amount = Object.hasOwn(i.data, "options")
          ? i.data.options[0].value
          : 2;

        if (i.channel?.isGuildText()) {
          if (amount <= 1) {
            await i.reply("Please provide a value greater than 1", {
              ephemeral: true,
            });
          } else if (amount > 1) {
            const doc = await dbCol.findOne(
              { guildId: i.guild?.id },
              { noCursorTimeout: false },
            );

            const auditCh = await i.guild?.channels.get(doc?.channelIds.audit!);

            await i.channel.bulkDelete(amount);
            await i.reply(`Deleted \`${amount}\` messages`, {
              ephemeral: true,
            });

            if (auditCh?.isGuildText()) {
              const embed = new Embed({
                author: { name: i.user.tag, icon_url: i.user.avatarURL() },
                description: `cleared \`${amount}\` messages in ${i.channel}`,
                color: ColorUtil.resolveRGB(constants.colorsArr["bionic"]),
              });

              await auditCh.send({ embed: embed });
            }
          }
        }
      }
    }
  }

  @slash()
  async spam(i: SlashCommandInteraction) {
    const randomSpam =
      constants.spamsArr[~~(Math.random() * constants.spamsArr.length)];

    await i.reply(randomSpam);
  }

  @slash()
  async say(i: SlashCommandInteraction) {
    if (i.data) {
      const echoStr: string = i.data.options
        .find((option) => option.name === "text")
        ?.value;

      const sponged = [];

      for (let charIdx = 0; charIdx < echoStr.length; charIdx++) {
        const randInt = ~~(Math.random() * 2);

        if (randInt === 0) {
          sponged.push(echoStr[charIdx].toUpperCase());
        } else {
          sponged.push(echoStr[charIdx].toLowerCase());
        }
      }

      const spongedText = sponged.join("");
      await i.reply(spongedText);
    }
  }

  @slash()
  async roles(i: SlashCommandInteraction) {
    const selectType: string = i.data.options[0].value!;
    const memberRolesArr = await i.member?.roles.array();
    const guildRolesArr = await i.guild?.roles.array();

    const doc = await dbCol.findOne({ guildId: i.guild!.id }, {
      noCursorTimeout: false,
    });

    const secondaryRoleIds = doc!.secondaryRoleIds;
    let rolesArr = Object.values(secondaryRoleIds);
    let roleOptionsArr: MessageComponentOption[] = [];

    Object.keys(secondaryRoleIds).map((key) => {
      roleOptionsArr.push({
        label: key,
        value: secondaryRoleIds[key],
      });
    });

    if (memberRolesArr != null && guildRolesArr != null) {
      const memberRoleIdsArr: string[] = [];

      memberRolesArr.forEach((mRole) => memberRoleIdsArr.push(mRole.id));

      if (selectType === "add") {
        rolesArr = rolesArr.filter((role) => !memberRoleIdsArr.includes(role));
      } else {
        rolesArr = rolesArr.filter((role) => memberRoleIdsArr.includes(role));
      }

      roleOptionsArr = roleOptionsArr.filter((roleOption) =>
        rolesArr.includes(roleOption.value)
      );

      const rolesRow: MessageComponentData[] = [{
        type: MessageComponentType.ACTION_ROW,
        components: [
          {
            type: MessageComponentType.SELECT,
            customID: "rolesRow",
            placeholder: selectType === "add" ? "Add roles" : "Remove roles",
            minValues: 1,
            maxValues: roleOptionsArr.length,
            options: roleOptionsArr,
          },
        ],
      }];

      if (roleOptionsArr.length === 0) {
        if (selectType === "add") {
          await i.reply("You can't add any more roles", { ephemeral: true })
            .catch((err) => console.error(err));
        } else {
          await i.reply("You can't remove any more roles", { ephemeral: true })
            .catch((err) => console.error(err));
        }
      } else {
        await i.reply("Select the roles you want from the list below", {
          components: rolesRow,
          ephemeral: true,
        }).catch((err) => console.error(err));
      }

      const collector = new Collector({
        event: "interactionCreate",
        filter: (colInter: Interaction) =>
          colInter.isMessageComponent() &&
          (colInter.customID === "rolesRow"),
        deinitOnEnd: true,
        max: 1,
        timeout: 60000,
      });

      collector.init(this);
      collector.collect();

      collector.on("collect", (colInter: Interaction) => {
        if (
          colInter.isMessageComponent() &&
          colInter.componentType === MessageComponentType.SELECT
        ) {
          const rolesArr = colInter.data.values || [];

          rolesArr.forEach(async (r) => {
            const guildRole = guildRolesArr.find((role) => role.id === r);

            if (guildRole != null) {
              if (selectType === "remove") {
                await i.member?.roles.remove(guildRole)
                  .catch((err) => console.error(err));
                await colInter.respond({
                  content: "Your roles have been updated",
                  components: [],
                  type: InteractionResponseType.UPDATE_MESSAGE,
                }).catch((err) => err);

                console.log(
                  `Removed ${guildRole.name} from ${i.member?.user.tag}`,
                );
              } else {
                await i.member?.roles.add(guildRole)
                  .catch((err) => console.error(err));
                await colInter.respond({
                  content: "Your roles have been updated",
                  components: [],
                  type: InteractionResponseType.UPDATE_MESSAGE,
                }).catch((err) => err);

                console.log(
                  `Given ${guildRole.name} to ${i.member?.user.tag}`,
                );
              }
            }
          });
        }
      });
    }
  }

  @slash()
  async vlrrank(i: SlashCommandInteraction) {
    if (i.data) {
      i.defer();

      const username: string = i.data.options
        .find((option) => option.name === "username")?.value;
      const usernameOptions = username.split("#");

      const region: string = i.data.options
        .find((option) => option.name === "region")?.value;

      const res = await fetch(
        `https://api.henrikdev.xyz/valorant/v1/mmr/${region}/${
          usernameOptions[0]
        }/${usernameOptions[1]}`,
      );

      const json: ValorantRankInfo = await res.json();

      if (Object.hasOwn(json, "message")) {
        switch (json.message) {
          case "User not found":
            await i.reply(
              "User not found. Make sure you provided a valid username and tagline.",
            );
            break;

          default:
            await i.reply(
              "Error happen! Pls try again UwU.",
            );
            break;
        }
      } else if (Object.hasOwn(json, "data")) {
        const rankFileName = json.data!.currenttierpatched
          .toLowerCase()
          .replaceAll(" ", "");

        const rankImage = await MessageAttachment.load(
          `./assets/ranks/${rankFileName}.png`,
          `${rankFileName}.png`,
        );

        const vlrLogo = await MessageAttachment.load(
          "./assets/vlrlogo.png",
          "vlrlogo.png",
        );

        const color = rankFileName.substring(
          0,
          rankFileName.length - 1,
        );

        const embed = new Embed({
          author: {
            name: `${json.data!.name}#${json.data!.tag}`,
            icon_url: "attachment://vlrlogo.png",
          },
          footer: {
            text: `Requested by: ${i.member!.user.tag}`,
            icon_url: i.member!.user.avatarURL(),
          },
          color: ColorUtil.resolveRGB(
            constants.colorsArr[color] ?? constants.colorsArr["valorant"],
          ),
          thumbnail: { url: `attachment://${rankFileName}.png` },
          fields: [
            {
              name: "Rank",
              value: json.data!.currenttierpatched,
              inline: true,
            },
            {
              name: "Progress",
              value: `${json.data!.elo.toString().slice(-2)}/100`,
              inline: true,
            },
          ],
        }).attach(rankImage, vlrLogo);

        await i.send({ embeds: [embed] });
      }
    }
  }

  @slash()
  async reqinvite(i: SlashCommandInteraction) {
    const doc = await dbCol.findOne(
      { guildId: i.guild?.id },
      { noCursorTimeout: false },
    );

    if (doc == null) {
      await i.reply(
        "Please set the admin channel with `/set` to use this command",
        { ephemeral: true },
      );
    } else if (doc.channelIds.admin != null && doc.channelIds.admin !== "") {
      const adminChannel = await i.guild?.channels.get(doc.channelIds.admin);

      if (adminChannel != null && adminChannel.isGuildText()) {
        await i.reply(
          "You will be sent a dm with the invite link if an admin approves your request.",
          { ephemeral: true },
        );

        const invUses: number = i.data.options
          ? i.data.options.find((option) => option.name === "uses")?.value
          : 2;

        const msg = await adminChannel.send(
          `${
            i.member?.user.tag
          } is requesting an invite link to ${i.channel} for \`${invUses}\` people`,
          {
            components: [{
              type: MessageComponentType.ACTION_ROW,
              components: [
                {
                  type: MessageComponentType.BUTTON,
                  customID: "acceptInviteReq",
                  label: "Accept",
                  style: "PRIMARY",
                },
                {
                  type: MessageComponentType.BUTTON,
                  customID: "declineInviteReq",
                  label: "Decline",
                  style: "SECONDARY",
                },
              ],
            }],
          },
        );

        const collector = new Collector({
          event: "interactionCreate",
          filter: (colInter: Interaction) =>
            colInter.message?.author.id === msg.author.id,
          deinitOnEnd: true,
          max: 1,
          timeout: 60000,
        });

        collector.init(this);
        collector.collect();

        collector.on("collect", async (colInter: Interaction) => {
          if (colInter.isMessageComponent()) {
            if (
              colInter.customID === "acceptInviteReq" &&
              i.channel?.isGuildText()
            ) {
              const invLink = await i.channel.createInvite({
                maxUses: invUses,
                maxAge: 6400,
                unique: true,
              });
              const dm = await i.member!.user.createDM();

              dm.send(invLink.link)
                .then(async () => await msg.delete());

              const auditCh = await i.guild?.channels.get(
                doc?.channelIds.audit!,
              );

              if (auditCh?.isGuildText()) {
                const embed = new Embed({
                  author: { name: i.user.tag, icon_url: i.user.avatarURL() },
                  description:
                    `accepted invite request by ${i.member} for ${i.channel} \`[${invUses} uses]\``,
                  color: ColorUtil.resolveRGB(constants.colorsArr["bionic"]),
                });

                await auditCh.send({ embed: embed });
              }
            } else if (colInter.customID === "declineInviteReq") {
              const dm = await i.member!.user.createDM();

              dm.send(
                `Your request for an invite link to Bionic ${i.channel} was declined`,
              )
                .then(async () => await msg.delete());
            }
          }
        });
      }
    }
  }

  @slash()
  async set(i: SlashCommandInteraction) {
    const hasPerms = i.member?.permissions.has("MANAGE_GUILD");

    if (!hasPerms) {
      await i.reply("You don't have the permission to use this command", {
        ephemeral: true,
      });
    } else {
      if (i.isApplicationCommand()) {
        if (i.options.length === 0) {
          await i.reply("Please select an option from the menu", {
            ephemeral: true,
          });
        } else {
          const doc = await dbCol.findOne(
            { guildId: i.guild?.id },
            { noCursorTimeout: false },
          );

          const auditCh = await i.guild?.channels.get(doc?.channelIds.audit!);

          if (i.subCommand === "channels") {
            i.options.forEach(async (option) => {
              await dbCol.updateOne(
                { guildId: i.guild?.id },
                { $set: { [`channelIds.${option.name}`]: option.value } },
              );

              const newCh = await i.guild?.channels.get(option.value);

              await i.reply(
                `${option.name} channel changed to ${newCh}`,
                {
                  ephemeral: true,
                },
              );

              if (auditCh?.isGuildText()) {
                const embed = new Embed({
                  author: { name: i.user.tag, icon_url: i.user.avatarURL() },
                  description: `changed ${option.name} channel to ${newCh}`,
                  color: ColorUtil.resolveRGB(constants.colorsArr["bionic"]),
                });

                await auditCh.send({ embed: embed });
              }
            });
          } else if (i.subCommand === "roles") {
            i.options.forEach(async (option) => {
              await dbCol.updateOne(
                { guildId: i.guild?.id },
                { $set: { [`primaryRoleIds.${option.name}`]: option.value } },
              );

              const newRole = await i.guild?.roles.get(option.value);

              await i.reply(`${option.name} changed to ${newRole?.name}`, {
                ephemeral: true,
              });

              if (auditCh?.isGuildText()) {
                const embed = new Embed({
                  author: { name: i.user.tag, icon_url: i.user.avatarURL() },
                  description: `changed ${option.name} role to ${newRole
                    ?.name}`,
                  color: ColorUtil.resolveRGB(constants.colorsArr["bionic"]),
                });

                await auditCh.send({ embed: embed });
              }
            });
          }
        }
      }
    }
  }

  @slash()
  async modifyselectroles(i: SlashCommandInteraction) {
    const hasPerms = i.member?.permissions.has("MANAGE_GUILD");

    if (!hasPerms) {
      await i.reply("You don't have the permission to use this command", {
        ephemeral: true,
      });
    } else {
      if (i.isApplicationCommand()) {
        if (i.options.length === 0) {
          await i.reply("Please provide a role to add", { ephemeral: true });
        } else {
          const doc = await dbCol.findOne(
            { guildId: i.guild?.id },
            { noCursorTimeout: false },
          );

          const auditCh = await i.guild?.channels.get(doc?.channelIds.audit!);
          const roleId: string = i.options[0].value;
          const role = await i.guild!.roles.get(roleId);

          await dbCol.updateOne(
            { guildId: i.guild!.id },
            { $set: { [`secondaryRoleIds.${role!.name}`]: roleId } },
          );

          await i.reply(`Added \`${role?.name}\` to self-assignable roles`, {
            ephemeral: true,
          });

          if (auditCh?.isGuildText()) {
            const embed = new Embed({
              author: { name: i.user.tag, icon_url: i.user.avatarURL() },
              description: `added \`${role?.name}\` to self-assignable roles`,
              color: ColorUtil.resolveRGB(constants.colorsArr["bionic"]),
            });

            await auditCh.send({ embed: embed });
          }
        }
      }
    }
  }
}

const bot = new DiscordBot({
  fetchUncachedReactions: true,
  presence: {
    activity: { "name": "/help for help", "type": "LISTENING" },
    status: "online",
  },
});

bot.connect(
  Deno.env.get("BIONIC_BOT_TOKEN"),
  Intents.All,
);
