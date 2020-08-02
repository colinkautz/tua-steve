import { ModerationCommand } from '@lib/structures/commands/ModerationCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { User, Guild, GuildMember, Message } from 'discord.js';

export default class extends ModerationCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: lang => lang.get('COMMAND_BAN_DESCRIPTION'),
			duration: true,
			extendedHelp: lang => lang.get('COMMAND_BAN_EXTENDED')
		});
	}

	public async prehandle(target: User, guild: Guild): Promise<GuildMember> {
		const member = await guild.members.fetch(target);
		if (!member) throw guild.language.tget('USER_NOT_IN_GUILD', target.tag);
		return member;
	}

	public async handle(msg: KlasaMessage, target: GuildMember, reason: string): Promise<GuildMember> {
		try {
			await msg.guild!.moderation.ban(target, reason);
		} catch (err) {
			this.client.console.error(err);
			throw msg.language.tget('COMMAND_BAN_UNABLE', target.user.tag);
		}

		return target;
	}

	public async posthandle(msg: KlasaMessage, target: GuildMember, reason: string, duration: number | undefined): Promise<Message> {
		const modTask = duration
			? await this.client.schedule.createModerationTask('unban', duration, { targetID: target.id, guildID: msg.guild!.id })
			: null;

		const thisCase = await msg.guild!.moderation.cases.createCase('ban', msg.author, target.user, reason, duration, modTask);

		return msg.channel.send(msg.language.tget('COMMAND_BAN_SUCCESS', target.user.tag, thisCase));
	}

}
