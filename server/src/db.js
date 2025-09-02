import mongoose from "mongoose";

export async function connectDB(uri) {
  if (!uri) throw new Error("Missing MongoDB URI");
  mongoose.set("strictQuery", true);
  mongoose.connection.on("connected", () => {
    const { host, name } = mongoose.connection;
    console.log(`✅ MongoDB connected to ${host}/${name}`);
  });
  mongoose.connection.on("error", (err) => {
    console.error(" MongoDB error:", err.message);
  });
  await mongoose.connect(uri); // db name can be in the URI path
}
