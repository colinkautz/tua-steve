import * as Genius from 'genius-lyrics';
import { CommandOptions, KlasaMessage } from 'klasa';
import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { Message, MessageEmbed } from 'discord.js';
import { TOKENS } from '@root/config';
import { ApplyOptions } from '@skyra/decorators';

@ApplyOptions<CommandOptions>({
	aliases: ['genius'],
	description: lang => lang.tget('COMMAND_LYRICS_DESCRIPTION'),
	extendedHelp: lang => lang.tget('COMMAND_LYRICS_EXTENDED'),
	usage: '<song:string>'
})
export default class extends SteveCommand {

	public async init(): Promise<void> {
		if (!TOKENS.GENIUS) this.disable();
	}

	public async run(msg: KlasaMessage, [song]: [string]): Promise<Message> {
		const Client = new Genius.Client(TOKENS.GENIUS);
		const songs = await Client.songs.search(song);

		if (songs.length < 1) throw msg.language.tget('COMMAND_LYRICS_NOLYRICS');

		const EMBED_DATA = msg.language.tget('COMMAND_LYRICS_EMBED');

		const embed = new MessageEmbed()
			.setTitle(EMBED_DATA.TITLE);

		for (let i = 0; i < 5; i++) {
			if (!songs[i]) break;
			embed
				.addFields([
					{ name: songs[i].fullTitle, value: songs[i].url }
				]);
		}

		return msg.channel.send(embed);
	}

}
