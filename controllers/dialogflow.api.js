const { dialogflow, } = require('../package-manager');
const { businessBotsConfig, } = require('../configs');

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} businessId The Business to be used
 * @param {string} sessionId  Unique session id for that whatsapp user
 * @param {string} query      Text message asked by whatsapp user
 */
async function queryDialogflow(businessId = '', sessionId = '', query) {
  try{
    // Create a new session
    const googleConfig = businessBotsConfig[businessId];
    const { project_id: projectId } = googleConfig;
    console.log("query would be switched to %s bot", projectId);
    console.log(`Session Id: ${sessionId}`);

    const sessionClient = new dialogflow.SessionsClient({ credentials: googleConfig });
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
    const { queryText, fulfillmentMessages, fulfillmentText = '', intent = {} } = result;

    console.log(`  Query: ${queryText}`);
    console.log(`  Response: ${fulfillmentText}`);

    if (intent) {
      console.log(`  Intent: ${intent.displayName}`);
      const dialogflowResponses = fulfillmentMessages.map(fulfillment => ({
        queryText,
        intent: intent.displayName,
        fulfillmentText: fulfillment.text.text[0]
      }));
      // return {
      //   queryText: queryText,
      //   fulfillmentText: fulfillmentText,
      //   intent: intent.displayName,
      // };
      return dialogflowResponses;
    } else {
      console.log(`  No intent matched.`);
      return null;
    }
  } catch (error) {
    throw error;
  }
}

exports.queryDialogflow = (businessId, sessionId, query) => queryDialogflow(businessId, sessionId, query);