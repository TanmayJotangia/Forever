import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("DB is connected");
  });

  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/forever`);
  } catch (error) {
    console.error("Error connecting to the database", error);
  }
};

export default connectDB;
