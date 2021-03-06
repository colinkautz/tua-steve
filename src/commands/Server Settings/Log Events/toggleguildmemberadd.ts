import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { PermissionsLevels } from '@lib/types/Enums';
import { GuildMessage } from '@lib/types/Messages';
import { GuildSettings } from '@lib/types/settings/GuildSettings';
import { ApplyOptions } from '@skyra/decorators';
import { Message } from 'discord.js';
import { CommandOptions } from 'klasa';

@ApplyOptions<CommandOptions>({
	aliases: ['tgma'],
	description: lang => lang.tget('commandToggleGuildMemberAddDescription'),
	permissionLevel: PermissionsLevels.MODERATOR,
	runIn: ['text']
})
export default class extends SteveCommand {

	public async run(msg: GuildMessage): Promise<Message> {
		const current = msg.guild.settings.get(GuildSettings.LogEvents.GuildMemberAdd) as boolean;

		await msg.guild.settings.update(GuildSettings.LogEvents.GuildMemberAdd, !current);

		return msg.channel.send(msg.guild.language.tget('commandToggleGuildMemberAdd', current));
	}

}
