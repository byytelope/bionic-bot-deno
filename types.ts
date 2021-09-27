interface ValorantRankInfo {
  status: string;
  data?: {
    "currenttier": number;
    "currenttierpatched": string;
    "ranking_in_tier": number;
    "mmr_change_to_last_game": number;
    "elo": number;
    "name": string;
    "tag": string;
  };
  message?: string;
}

interface ColorArr {
  [key: string]: [number, number, number];
}

interface GuildConfig {
  _id: { $oid: string };
  guildId: string;
  primaryRoleIds: {
    verified: string;
    unverified: string;
    bot: string;
  };
  secondaryRoleIds: Record<string, string>;
  channelIds: {
    welcome: string;
    admin: string;
    audit: string;
  };
}

export type { ColorArr, GuildConfig, ValorantRankInfo };
