const { dialogflow, } = require('../package-manager');
const { googleConfigs } = require('../configs');

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
async function queryDialogflow(projectId = '', sessionId = '', query) {
  try{
    // Create a new session
    const googleConfig = googleConfigs[projectId];
    console.log("query would be switched to %s bot", projectId);
    const sessionClient = new dialogflow.SessionsClient({
      credentials: googleConfig
    });
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    // The text query request.
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          // The query to send to the dialogflow agent
          text: query,
          // The language used by the client (en-US)
          languageCode: 'en-US',
        },
      },
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    console.log('Detected intent');
    const result = responses[0].queryResult;
    const { queryText, fulfillmentText = '', intent = {} } = result;

    console.log(`  Query: ${queryText}`);
    console.log(`  Response: ${fulfillmentText}`);

    if (intent) {
      console.log(`  Intent: ${intent.displayName}`);
      return {
        queryText: queryText,
        fulfillmentText: fulfillmentText,
        intent: intent.displayName,
      };
    } else {
      console.log(`  No intent matched.`);
      return null;
    }
  } catch (error) {
    throw error;
  }
}

exports.queryDialogflow = (projectId, sessionId, query) => queryDialogflow(projectId, sessionId, query);