import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { PermissionsLevels } from '@lib/types/Enums';
import { GuildSettings } from '@lib/types/settings/GuildSettings';
import { ApplyOptions } from '@skyra/decorators';
import { Message } from 'discord.js';
import { CommandOptions, KlasaMessage } from 'klasa';

@ApplyOptions<CommandOptions>({
	aliases: ['tcu'],
	description: lang => lang.tget('COMMAND_TOGGLECHANNELUPDATE_DESCRIPTION'),
	permissionLevel: PermissionsLevels.MODERATOR,
	runIn: ['text']
})
export default class extends SteveCommand {

	public async run(msg: KlasaMessage): Promise<Message> {
		const current = msg.guild!.settings.get(GuildSettings.LogEvents.ChannelUpdate) as boolean;

		await msg.guild!.settings.update(GuildSettings.LogEvents.ChannelUpdate, !current);

		return msg.channel.send(msg.guild!.language.tget('COMMAND_TOGGLECHANNELUPDATE', current));
	}

}
