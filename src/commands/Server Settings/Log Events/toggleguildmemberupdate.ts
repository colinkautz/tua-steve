import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { PermissionsLevels } from '@lib/types/Enums';
import { GuildMessage } from '@lib/types/Messages';
import { GuildSettings } from '@lib/types/settings/GuildSettings';
import { ApplyOptions } from '@skyra/decorators';
import { Message } from 'discord.js';
import { CommandOptions } from 'klasa';

@ApplyOptions<CommandOptions>({
	aliases: ['tgmu'],
	description: lang => lang.tget('commandToggleGuildMemberUpdateDescription'),
	permissionLevel: PermissionsLevels.MODERATOR,
	runIn: ['text']
})
export default class extends SteveCommand {

	public async run(msg: GuildMessage): Promise<Message> {
		const current = msg.guild.settings.get(GuildSettings.LogEvents.GuildMemberUpdate) as boolean;

		await msg.guild.settings.update(GuildSettings.LogEvents.GuildMemberUpdate, !current);

		return msg.channel.send(msg.guild.language.tget('commandToggleGuildMemberUpdate', current));
	}

}
