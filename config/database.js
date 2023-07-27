const mongoose = require('mongoose')
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB, () => {
  console.log("Connected to MongoDB");
});