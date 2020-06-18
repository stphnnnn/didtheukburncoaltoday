// A MongoDB Scheduled Trigger (https://docs.mongodb.com/realm/triggers/scheduled-triggers/)
// Configured to run every 30 minutes to keep the database up to date with the carbon intensity API

exports = async function () {
  const collection = context.services
    .get("Cluster0")
    .db("coal")
    .collection("timeblocks");

  const baseUrl = "https://drax-production.herokuapp.com/api/1/generation-mix";

  // Get data from 1 hour ago to now
  const to = new Date();
  const from = new Date(to.getTime() - 60 * 60000);

  const url = `${baseUrl}?group_by=30m&date_from=${from.toISOString()}&date_to=${to.toISOString()}`;

  const response = await context.http.get({ url });
  const json = EJSON.parse(response.body.text());

  const document = {
    to: json[0].start,
    from: json[0].end,
    mix: json[0].value,
  };

  collection.insertOne(document);
};
