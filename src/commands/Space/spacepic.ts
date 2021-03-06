import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { CommandOptions, KlasaMessage } from 'klasa';
import { TOKENS } from '@root/config';
import axios from 'axios';
import { MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@skyra/decorators';
import { formatDate, sendLoadingMessage } from '@utils/util';

@ApplyOptions<CommandOptions>({
	aliases: ['apod'],
	cooldown: 30,
	cooldownLevel: 'author',
	description: lang => lang.tget('commandSpacePicDescription'),
	extendedHelp: lang => lang.tget('commandSpacePicExtended'),
	requiredPermissions: ['EMBED_LINKS'],
	usage: '[date:date]'
})
export default class extends SteveCommand {

	private baseUrl = `https://api.nasa.gov/planetary/apod?api_key=${TOKENS.NASA}`;

	public async init() {
		if (!TOKENS.NASA) this.disable();
	}

	public async run(msg: KlasaMessage, [date]: [Date]) {
		const response = await sendLoadingMessage(msg);

		try {
			const res = await axios.get<ApodResponse>(`${this.baseUrl}${date ? `&date=${formatDate(date, 'YYYY-MM-DD')}` : ''}`);

			if (res.statusText === 'OK') {
				const { data } = res;

				const embed = new MessageEmbed()
					.setDescription(data.explanation)
					.setImage(data.hdurl)
					.setTitle(`${data.title} (${data.date})`);

				if (data.copyright) embed.setFooter(`Copyright ${data.copyright}`);

				return response.edit(undefined, embed);
			}
		} catch {
			return response.edit(msg.language.tget('commandSpacePicError'), { embed: null });
		}
	}

}

interface ApodResponse {
	copyright?: string;
	date: string;
	explanation: string;
	hdurl: string;
	media_type: string;
	service_version: string;
	title: string;
	url: string;
}
