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
        .setName("password")
        .setDescription("If left empty no password will be set")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("expiration")
        .setDescription("The expiration date of the shortened URL")
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async execute(interaction) {
    const redirectUrl = interaction.options.getString("original_url");
    const customSlug = interaction.options.getString("custom_slug");
    var password = interaction.options.getString("password");
    var isPasswordProtected = false;
    if (password !== "") {
      isPasswordProtected = true;
    }
    if (password == false) {
      password = "";
    }
    const expiration = interaction.options.getString("expiration");
    const deleteAfterViewed = false;

    const response = await axios.post("https://dev.xurl.app/new", [{
      type: "SHORTURL",
      linkUrl: customSlug,
      isPasswordProtected: isPasswordProtected,
      password: password,
      expiration: expiration,
      deleteAfterViewed: deleteAfterViewed,
      redirectUrl: redirectUrl,
    }]);

    console.log(response.data);
    const message = response.data[1].message;

    await interaction.reply({
      content: message,
      ephemeral: true,
    });
    return;
  },
  data: new SlashCommandBuilder()
    .setName("shorturl")
    .setDescription("Create a shortened link")
    .addStringOption(option =>
        option.setName('original_url')
            .setDescription('The original URL')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('custom_slug')
            .setDescription('A custom slug for the shortened URL')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('expiration')
            .setDescription('The expiration date of the shortened URL')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('password')
            .setDescription('If left empty no password will be set')
            .setRequired(false)),
};