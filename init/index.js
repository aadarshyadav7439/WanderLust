const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongoURL = "mongodb://localhost:27017/wanderlust";
async function main() {
  await mongoose.connect(mongoURL);
}

main()
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=>({...obj , owner : "6a5ba6bb4cf819a2a13342d2"}));
  await Listing.insertMany(initData.data);
  console.log("data isinitiliazed succesylly");
};

initDB();
