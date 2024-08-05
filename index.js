const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
require("dotenv").config();
const path = require("path");
const clc = require("cli-color");

const client = new Client({
  intents: [],
});

client.commands = new Collection();

const commandFiles = fs
  .readdirSync(path.join(__dirname, "commands"))
  .filter((file) => file.endsWith(".js"));

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  commandFiles.forEach((file) => {
    const command = require(`./commands/${file}`);
    if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
      console.log(
        clc.greenBright(`[INFO] Loaded command ${command.data.name}`)
      );
    }
  });

  client.application.commands.set(
    client.commands.map((command) => command.data)
  );
  console.log(`[INFO] Registered ${client.commands.size} commands`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(clc.redBright(error));
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isAutocomplete()) return;

  const focusedOption = interaction.options.getFocused(true);

  if (focusedOption.name === "expiration") {
    const options = ["5m", "30m", "1h", "1d", "1w"];
    const filtered = options.filter((value) =>
      value.includes(focusedOption.value)
    );

    await interaction.respond(
      filtered.map((value) => ({
        name: value,
        value: value,
      }))
    );
  }
});

client.login(process.env.DISCORD_TOKEN);
