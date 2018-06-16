const { Monitor } = require("klasa");

module.exports = class extends Monitor {

    constructor(...args) {
        super(...args, { ignoreOthers: false });
    }

    async run(msg) {
        if (!msg.guild || !msg.channel.postable || msg.author.id === this.client.user.id) return;
        if (this.client.configs.userBlacklist.includes(msg.author.id) || this.client.configs.guildBlacklist.includes(msg.guild.id)) return;

        const member = await msg.guild.members.fetch("438049470094114816").catch(() => null);
        if (member && !this.client.config.main.patreon) return;

        if (msg.mentions.users.size) {
            const mentioned = msg.mentions.users.first();
            if (mentioned.configs.afk.afk) {
                msg.sendMessage(`⏰ | ***${mentioned.tag} ${msg.language.get("MESSAGE_IS_AFK")}*** ${mentioned.configs.afk.reason}`);
            }
        }

        if (msg.author.configs.afk.afk) {
            await msg.author.configs.update(["afk.afk", "afk.reason"], [false, null]);
            const m = await msg.sendMessage(`<:penguError:435712890884849664> ***${msg.author.tag} ${msg.language.get("MESSAGE_AFK_REMOVED")}***`);
            await m.delete({ timeout: 10000 });
        }
    }

};
