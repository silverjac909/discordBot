// for use with reddit api
const snoowrap = require('snoowrap');
const { Submission } = require('snoowrap');

const { clientId, clientSecret, username, password } = require('../config.json');

// reddit api constructor 
const r = new snoowrap({
    userAgent: 'reddit-bot-example-node',
    clientId: clientId,
    clientSecret: clientSecret,
    username: username,
    password: password
});

// function breaks up string into size specified 
// returns array of strings afterwards 
function chunkString(str, size) {
    const numChunks = Math.ceil(str.length / size)
    const chunks = new Array(numChunks)
  
    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
      chunks[i] = str.substr(o, size)
    }
  
    return chunks
  }

module.exports = {
    name: 'copypasta',
    description: 'Finds a copy pasta',
    execute(message, args) {

        var copypasta;

         r.getSubreddit('copypasta').getRandomSubmission().fetch().then( Submission => {
            copypasta = Submission.selftext;

            // discord only allows 2000 chars sent, so this is a word around, splits string into len of 1999 if it's over 2000
            if(copypasta.length > 2000 ){
                var chunks = chunkString(copypasta, 1999);

                for( i = 0; i < chunks.length; i++ ){
                    message.channel.send(chunks[i]);
                }
            } else{
                message.channel.send( copypasta );
            }
         }) ;
    },
};