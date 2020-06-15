// A MongoDB Scheduled Trigger (https://docs.mongodb.com/realm/triggers/scheduled-triggers/)
// Configured to run every 30 minutes to keep the database up to date with the carbon intensity API

exports = async function () {
  const collection = context.services
    .get("Cluster0")
    .db("coal")
    .collection("timeblocks");

  const response = await context.http.get({
    url: "https://api.carbonintensity.org.uk/generation",
  });

  const json = EJSON.parse(response.body.text());

  // Transforms "generationmix" array into an object
  const mix = json.data.generationmix.reduce((acc, curr) => {
    acc[curr.fuel] = curr.perc;
    return acc;
  }, {});

  collection.insertOne({
    to: json.data.to,
    from: json.data.from,
    mix: mix,
  });
};
