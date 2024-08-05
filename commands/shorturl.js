const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shorturl")
    .setDescription("Create a shortened link")
    .addStringOption((option) =>
      option
        .setName("original_url")
        .setDescription("The original URL")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("custom_slug")
        .setDescription("A custom slug for the shortened URL")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("expiration")
        .setDescription("The expiration date of the shortened URL")
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("delete_after_viewed")
        .setDescription("Delete the shortened URL after it is viewed")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("password")
        .setDescription("If left empty no password will be set")
        .setRequired(false)
    ),
  async execute(interaction) {
    const redirectUrl = interaction.options.getString("original_url");
    const customSlug = interaction.options.getString("custom_slug");
    var delete_after_viewed = interaction.options.getBoolean(
      "delete_after_viewed"
    );
    if (delete_after_viewed == null) {
      delete_after_viewed = false;
    }
    var password = interaction.options.getString("password");
    if (password == null) {
      password = "";
    }
    var isPasswordProtected = false;
    if (password !== "") {
      isPasswordProtected = true;
    }

    const expiration = interaction.options.getString("expiration");

    const response = await axios.post(
      "https://dev.xurl.app/new",
      [
        {
          type: "SHORTURL",
          linkUrl: customSlug,
          isPasswordProtected: isPasswordProtected,
          password: password,
          expiration: expiration,
          deleteAfterViewed: delete_after_viewed,
          redirectUrl: redirectUrl,
        },
      ],
      {
        headers: {
          "Next-Action": "3774e7c1e033dcdb244a6200e4f005219fe4db32",
        },
      }
    );

    const res = response.data;
    const row = res.split("\n")[1].slice(2);
    const message = JSON.parse(row).message;

    await interaction.reply({
      content: message,
      ephemeral: true,
    });
    return;
  },
};
