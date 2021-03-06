import { ApplyOptions } from '@skyra/decorators';
import { Inhibitor, InhibitorOptions, KlasaMessage } from 'klasa';

@ApplyOptions<InhibitorOptions>({
	spamProtection: true
})
export default class extends Inhibitor {

	public run(msg: KlasaMessage): void {
		if (msg.channel.type === 'dm') return;

		if (msg.content.match(/<@&\d*>/)) {
			throw msg.language.tget('inhibitorPingProtectionEveryone');
		}

		if (msg.content.match(/@everyone/)) {
			throw msg.language.tget('inhibitorPingprotectionEveryone');
		}
	}

}
