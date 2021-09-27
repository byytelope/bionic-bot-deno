  // @slash()
  // async upgraderole(i: SlashCommandInteraction) {
  //   const memberObj = i.data.options[0];
  //   const member = await i.guild?.members.fetch(memberObj.value);

  //   if (member != null && member?.user.bot) {
  //     await i.reply("Dis a bot");
  //   } else if (member != null) {
  //     const guildRolesArr = await i.guild?.roles.array();

  //     const sovietUnionRole = guildRolesArr
  //       ?.find((role) => role.id === secrets.SOVIETUNION_ROLE_ID)!;
  //     const chernobylRole = guildRolesArr
  //       ?.find((role) => role.id === secrets.CHERNOBYL_ROLE_ID)!;
  //     const threeMileIslandRole = guildRolesArr
  //       ?.find((role) => role.id === secrets.THREEMILEISLAND_ROLE_ID)!;
  //     const fukushimaDaiichiRole = guildRolesArr
  //       ?.find((role) => role.id === secrets.FUKUSHIMADAIICHI_ROLE_ID)!;
  //     const fukushimaDainiRole = guildRolesArr
  //       ?.find((role) => role.id === secrets.FUKUSHIMADAINI_ROLE_ID)!;

  //     const memberRolesArr = await member.roles.array();

  //     if (
  //       (memberRolesArr
  //         .find((role) => role.id === sovietUnionRole.id) != null)
  //     ) {
  //       await i.reply(
  //         `${member.user.mention}'s role cannot be upgraded any further`,
  //         { ephemeral: true },
  //       );
  //     } else if (
  //       memberRolesArr.find((role) => role.id === chernobylRole.id) != null
  //     ) {
  //       await member.roles.add(sovietUnionRole);
  //       await member.roles.remove(chernobylRole);

  //       await i.reply(
  //         `${member.user.mention}'s role has been upgraded to ${sovietUnionRole.name}`,
  //         { ephemeral: true },
  //       );
  //     } else if (
  //       memberRolesArr.find((role) => role.id === threeMileIslandRole.id) !=
  //         null
  //     ) {
  //       await member.roles.add(chernobylRole);
  //       await member.roles.remove(threeMileIslandRole);

  //       await i.reply(
  //         `${member.user.mention}'s role has been upgraded to ${chernobylRole.name}`,
  //         { ephemeral: true },
  //       );
  //     } else if (
  //       memberRolesArr.find((role) => role.id === fukushimaDaiichiRole.id) !=
  //         null
  //     ) {
  //       await member.roles.add(threeMileIslandRole);
  //       await member.roles.remove(fukushimaDaiichiRole);

  //       await i.reply(
  //         `${member.user.mention}'s role has been upgraded to ${threeMileIslandRole.name}`,
  //         { ephemeral: true },
  //       );
  //     } else if (
  //       memberRolesArr.find((role) => role.id === fukushimaDainiRole.id) !=
  //         null
  //     ) {
  //       await member.roles.add(fukushimaDaiichiRole);
  //       await member.roles.remove(fukushimaDainiRole);

  //       await i.reply(
  //         `${member.user.mention}'s role has been upgraded to ${fukushimaDaiichiRole.name}`,
  //         { ephemeral: true },
  //       );
  //     }
  //   }
  // }

  // @slash()
  // async downgraderole(i: SlashCommandInteraction) {
  //   const memberObj = i.data.options[0];
  //   const member = await i.guild?.members.fetch(memberObj.value);

  //   if (member != null && member?.user.bot) {
  //     await i.reply("Dis a bot");
  //   } else if (member != null) {
  //     const guildRolesArr = await i.guild?.roles.array();

  //     const sovietUnionRole = guildRolesArr
  //       ?.find((role) => role.id === secrets.SOVIETUNION_ROLE_ID)!;
  //     const chernobylRole = guildRolesArr
  //       ?.find((role) => role.id === secrets.CHERNOBYL_ROLE_ID)!;
  //     const threeMileIslandRole = guildRolesArr
  //       ?.find((role) => role.id === secrets.THREEMILEISLAND_ROLE_ID)!;
  //     const fukushimaDaiichiRole = guildRolesArr
  //       ?.find((role) => role.id === secrets.FUKUSHIMADAIICHI_ROLE_ID)!;
  //     const fukushimaDainiRole = guildRolesArr
  //       ?.find((role) => role.id === secrets.FUKUSHIMADAINI_ROLE_ID)!;

  //     const memberRolesArr = await member.roles.array();

  //     if (
  //       (memberRolesArr.find((role) => role.id === fukushimaDainiRole.id) !=
  //         null)
  //     ) {
  //       await i.reply(
  //         `${member.user.mention}'s role cannot be downgraded any further`,
  //         { ephemeral: true },
  //       );
  //     } else if (
  //       memberRolesArr.find((role) => role.id === fukushimaDaiichiRole.id) !=
  //         null
  //     ) {
  //       await member.roles.add(fukushimaDainiRole);
  //       await member.roles.remove(fukushimaDaiichiRole);

  //       await i.reply(
  //         `${member.user.mention}'s role has been downgraded to ${fukushimaDainiRole.name}`,
  //         { ephemeral: true },
  //       );
  //     } else if (
  //       memberRolesArr.find((role) => role.id === threeMileIslandRole.id) !=
  //         null
  //     ) {
  //       await member.roles.add(fukushimaDaiichiRole);
  //       await member.roles.remove(threeMileIslandRole);

  //       await i.reply(
  //         `${member.user.mention}'s role has been downgraded to ${fukushimaDaiichiRole.name}`,
  //         { ephemeral: true },
  //       );
  //     } else if (
  //       memberRolesArr.find((role) => role.id === chernobylRole.id) !=
  //         null
  //     ) {
  //       await member.roles.add(threeMileIslandRole);
  //       await member.roles.remove(chernobylRole);

  //       await i.reply(
  //         `${member.user.mention}'s role has been downgraded to ${threeMileIslandRole.name}`,
  //         { ephemeral: true },
  //       );
  //     } else if (
  //       memberRolesArr.find((role) => role.id === sovietUnionRole.id) != null
  //     ) {
  //       await member.roles.add(chernobylRole);
  //       await member.roles.remove(sovietUnionRole);

  //       await i.reply(
  //         `${member.user.mention}'s role has been downgraded to ${chernobylRole.name}`,
  //         { ephemeral: true },
  //       );
  //     }
  //   }
  // }


  // {
  //   name: "upgraderole",
  //   description: "Upgrade member role",
  //   options: [
  //     {
  //       name: "member",
  //       type: "USER",
  //       description: "Tag one member that you want to upgrade",
  //       required: true,
  //     },
  //   ],
  // },
  // {
  //   name: "downgraderole",
  //   description: "Downgrade member role",
  //   options: [
  //     {
  //       name: "member",
  //       type: "USER",
  //       description: "Tag one member that you want to downgrade",
  //       required: true,
  //     },
  //   ],
  // },