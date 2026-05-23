// config/db.js
import mongoose from "mongoose";


const connectDB = async () => {
  const connect = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // retry faster
      });
      console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
      console.error(`❌ MongoDB connection failed: ${error.message}`);
      console.log("🔁 Retrying in 5 seconds...");
      setTimeout(connect, 5000); // auto-retry every 5 seconds
    }
  };

  connect();

  // Optional: handle events
  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected. Attempting to reconnect...");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("✅ MongoDB reconnected!");
  });
};

export default connectDB;




// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI);
//     console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`❌ Error: ${error.message}`);
//     process.exit(1);
//   }
// };

// export default connectDB;



// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`❌ Error: ${error.message}`);
//     process.exit(1);
//   }
// };

// export default connectDB;
