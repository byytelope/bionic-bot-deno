import { SlashCommandPartial } from "./deps.ts";

export const commandPartials: SlashCommandPartial[] = [
  {
    name: "ping",
    description: "Check bot ping",
  },
  {
    name: "roles",
    description: "Give yourself roles",
    options: [
      {
        name: "select",
        type: "STRING",
        description: "Select between adding or removing roles",
        required: true,
        choices: [
          {
            name: "add",
            value: "add",
          },
          {
            name: "remove",
            value: "remove",
          },
        ],
      },
    ],
  },
  {
    name: "help",
    description: "If you need help with the bot",
  },
  {
    name: "cls",
    description: "[ADMIN] Delete messages",
    options: [
      {
        name: "amount",
        type: "NUMBER",
        description: "Number of messages you want to delete (default: 2)",
        required: false,
      },
    ],
  },
  {
    name: "spam",
    description: "Shitposts",
  },
  {
    name: "say",
    description: "maKE tHe BoT rePeAT AnYThinG yOU waNT",
    options: [
      {
        name: "text",
        type: "STRING",
        description: "The text you want the bot to repeat",
        required: true,
      },
    ],
  },
  {
    name: "vlrrank",
    description: "Get your Valorank rank info",
    options: [
      {
        name: "username",
        type: "STRING",
        description: "Your Valorant username in the format `username#tag`",
        required: true,
      },
      {
        name: "region",
        type: "STRING",
        description: "Your Valorant username in the format {username}#{tag}",
        required: true,
        choices: [
          {
            name: "Asia Pacific, Oceania",
            value: "ap",
          },
          {
            name: "Europe",
            value: "eu",
          },
          {
            name: "North America, LATAM, or Brazil",
            value: "na",
          },
          {
            name: "South Korea",
            value: "kr",
          },
        ],
      },
    ],
  },
  {
    name: "reqinvite",
    description: "Request an invite link",
    options: [
      {
        name: "uses",
        type: "NUMBER",
        description: "How many people can use the invite (default: 2)",
        required: false,
      },
    ],
  },
  {
    name: "set",
    description: "[ADMIN] Set roles and channels",
    options: [
      {
        name: "channels",
        description: "Set channels",
        type: "SUB_COMMAND",
        options: [
          {
            name: "welcome",
            type: "CHANNEL",
            description: "Welcome channel (for verifying new members)",
          },
          {
            name: "admin",
            type: "CHANNEL",
            description: "Admin channel (for invite link verification)",
          },
          {
            name: "audit",
            type: "CHANNEL",
            description: "Audit channel (for keeping logs of bot actions)",
          },
        ],
      },
      {
        name: "roles",
        description: "Set roles",
        type: "SUB_COMMAND",
        options: [
          {
            name: "verified",
            type: "ROLE",
            description: "Role for verified new members",
          },
          {
            name: "unverified",
            type: "ROLE",
            description: "Role for unverified new members",
          },
          {
            name: "bot",
            type: "ROLE",
            description: "Role for bots",
          },
        ],
      },
    ],
  },
  {
    name: "modifyselectroles",
    description:
      "[ADMIN] Modify the roles that can be self-assigned using `/roles`",
    options: [
      {
        name: "add",
        description: "Add roles",
        type: "ROLE",
        required: true,
      },
    ],
  },
];
