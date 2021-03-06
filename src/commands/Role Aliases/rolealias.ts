import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { PermissionsLevels } from '@lib/types/Enums';
import { GuildMessage } from '@lib/types/Messages';
import { GuildSettings } from '@lib/types/settings/GuildSettings';
import { ApplyOptions, CreateResolvers } from '@skyra/decorators';
import { Role } from 'discord.js';
import { CommandOptions } from 'klasa';

@ApplyOptions<CommandOptions>({
	aliases: ['ra'],
	description: lang => lang.tget('commandRoleAliasDescription'),
	extendedHelp: lang => lang.tget('commandRoleAliasExtended'),
	permissionLevel: PermissionsLevels.MODERATOR,
	runIn: ['text'],
	subcommands: true,
	usage: '<add|remove> <alias:string{2,30}> (role:rolename)'
})
@CreateResolvers([
	[
		'rolename',
		(str, possible, msg, [action]) => action === 'add'
			? msg.client.arguments.get('rolename').run(str, possible, msg)
			: null
	]
])
export default class extends SteveCommand {

	public async add(msg: GuildMessage, [alias, role]: [string, Role]) {
		const roleAliases: RoleAlias[] = msg.guild.settings.get(GuildSettings.RoleAliases);

		if (this.roleAliasExists(roleAliases, alias)) {
			throw msg.guild.language.tget('commandRoleAliasAlreadyExists', alias);
		}

		await msg.guild.settings.update(GuildSettings.RoleAliases, this.createRoleAlias(alias, role), { action: 'add' });

		return msg.channel.send(msg.guild.language.tget('commandRoleAliasAdd', alias.toLowerCase(), role.name));
	}

	public async remove(msg: GuildMessage, [alias]: [string]) {
		const roleAliases: RoleAlias[] = msg.guild.settings.get(GuildSettings.RoleAliases);

		if (!this.roleAliasExists(roleAliases, alias)) {
			throw msg.guild.language.tget('commandRoleAliasDoesNotExist', alias);
		}

		const removedAlias = roleAliases.find(ra => ra.alias === alias.toLowerCase());

		await msg.guild.settings.update(GuildSettings.RoleAliases, removedAlias, { action: 'remove' });

		return msg.channel.send(msg.guild.language.tget('commandRoleAliasRemove', alias.toLowerCase()));
	}

	private createRoleAlias(alias: string, role: Role): RoleAlias {
		return { alias: alias.toLowerCase().replace(/ /g, ''), role: role.id };
	}

	private roleAliasExists(aliases: RoleAlias[], newAlias: string) {
		return aliases.some(alias => alias.alias === newAlias.toLowerCase());
	}

}

export interface RoleAlias {
	alias: string;
	role: string; // snowflake
}
