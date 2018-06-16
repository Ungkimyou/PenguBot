const { Monitor } = require("klasa");
const { Canvas } = require("canvas-constructor");
const fs = require("fs-nextra");
const { get } = require("snekfetch");

const timeout = new Set();

module.exports = class extends Monitor {

    constructor(...args) {
        super(...args, {
            ignoreBots: true,
            ignoreSelf: true,
            ignoreOthers: false
        });
    }

    async run(msg) {
        if (!msg.guild) return;
        if (timeout.has(msg.author.id)) return;
        const member = await msg.guild.members.fetch("438049470094114816").catch(() => null);
        if (member && !this.client.config.main.patreon) return;
        if (this.client.configs.userBlacklist.includes(msg.author.id) || this.client.configs.guildBlacklist.includes(msg.guild.id)) return;

        await msg.author.configs.waitSync();
        if (!msg.author.configs) return;

        const randomXP = this.client.functions.randomNumber(1, 5);
        const randomSnowflakes = this.client.functions.randomNumber(1, 2);
        const newSnowflakes = msg.author.configs.snowflakes + randomSnowflakes;
        const newXP = msg.author.configs.xp + randomXP;
        const oldLvl = msg.author.configs.level;
        const newLvl = Math.floor(0.2 * Math.sqrt(newXP));
        await msg.author.configs.update(["xp", "level", "snowflakes"], [newXP, newLvl, newSnowflakes]);

        timeout.add(msg.author.id);
        setTimeout(() => timeout.delete(msg.author.id), 45000);

        // Generate Level Up Images on Level Up
        if (oldLvl !== newLvl) {
            if (!msg.guild.configs.levelup) return;
            if (!msg.channel.postable) return;
            const bgName = msg.author.configs.profilebg;
            const bgImg = await fs.readFile(`${process.cwd()}/assets/profiles/bg/${bgName}.png`);
            const avatar = await get(msg.author.displayAvatarURL({ format: "png", size: 128 })).then(res => res.body).catch(e => {
                Error.captureStackTrace(e);
                return e;
            });
            const img = await new Canvas(100, 100)
                .addImage(bgImg, 0, 0, 530, 530)
                .addImage(avatar, 22, 22, 57, 57)
                .toBufferAsync();
            msg.sendMessage(`🆙 | **${msg.author.tag} leveled up to Level ${newLvl}!**`, { files: [{ attachment: img, name: `${msg.author.id}.png` }] });
        }
    }

    async init() {
        if (!this.client.gateways.users.schema.has("xp")) {
            this.client.gateways.users.schema.add("xp", { type: "integer", default: 0, configurable: false });
        }
        if (!this.client.gateways.users.schema.has("level")) {
            this.client.gateways.users.schema.add("level", { type: "integer", default: 0, configurable: false });
        }
        if (!this.client.gateways.users.schema.has("snowflakes")) {
            this.client.gateways.users.schema.add("snowflakes", { type: "integer", default: 0, configurable: false });
        }
    }

};
