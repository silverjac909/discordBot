const fs = require('fs');
const discord = require("discord.js");

// for use with reddit api
const snoowrap = require('snoowrap');

// secret info we need to run bot
const { prefix, token } = require('./config.json');

const client = new discord.Client();
client.commands = new discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for( const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// when the cient is ready, this runs
// this event will trigger once after the client is logged in
client.once('ready', ()=> {
    console.log('Ready!');
});

client.on('message', message => {

    if (!message.content.startsWith(prefix) || message.author.bot) {
        return;
    }

    

    // slices off the prefix entirely and removes leftover whitespaces
    // command: takes the first element in the array and returns it, bt also removes it from the original array
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if(!client.commands.has(command)) return;

    try{
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command, smelly.');
    }

    
});

// login with the app's token
client.login(token);