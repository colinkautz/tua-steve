import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { PermissionsLevels } from '@lib/types/Enums';
import { GuildMessage } from '@lib/types/Messages';
import { GuildSettings } from '@lib/types/settings/GuildSettings';
import { ApplyOptions } from '@skyra/decorators';
import { Message } from 'discord.js';
import { CommandOptions } from 'klasa';

@ApplyOptions<CommandOptions>({
	description: lang => lang.tget('commandManageWordBlacklistDescription'),
	extendedHelp: lang => lang.tget('commandManageWordBlacklistExtended'),
	permissionLevel: PermissionsLevels.MODERATOR,
	runIn: ['text'],
	usage: '<enable|disable|reset|word:string>'
})
export default class extends SteveCommand {

	public async run(msg: GuildMessage, [word]: [string]): Promise<Message> {
		if (word === 'enable') {
			await msg.guild.settings.update(GuildSettings.WordBlacklist.Enabled, true);

			return msg.channel.send(msg.guild.language.tget('commandManageWordBlacklistEnabled'));
		} else if (word === 'disable') {
			await msg.guild.settings.update(GuildSettings.WordBlacklist.Enabled, false);

			return msg.channel.send(msg.guild.language.tget('commandManageWordBlacklistDisabled'));
		} else if (word === 'reset') {
			await msg.guild.settings.reset(GuildSettings.WordBlacklist.List);

			return msg.channel.send(msg.guild.language.tget('commandManageWordBlacklistReset'));
		}

		const removing = (msg.guild.settings.get(GuildSettings.WordBlacklist.List) as string[]).includes(word);

		await msg.guild.settings.update(GuildSettings.WordBlacklist.List, word);

		return msg.channel.send(msg.guild.language.tget('commandManageWordBlacklistUpdate', removing));
	}

}
