const Command = require("../../../lib/structures/KlasaCommand");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            guarded: true,
            requiredPermissions: ["EMBED_LINKS", "ATTACH_FILES"],
            description: language => language.get("COMMAND_UPVOTE_DESCRIPTION")
        });
    }

    async run(msg) {
        const embed = new MessageEmbed()
            .setDescription(msg.language.get("COMMAND_UPVOTE"))
            .setAuthor("PenguBot - Upvote", this.client.user.displayAvatarURL(), "https://discordbots.org/bot/PenguBot/vote")
            .setThumbnail("https://i.imgur.com/YxmvOHj.png")
            .setColor("RANDOM");
        return msg.sendEmbed(embed);
    }

};
