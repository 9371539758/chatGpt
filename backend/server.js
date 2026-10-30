import {connectDB} from './src/config/data.js';
import {env} from './src/config/env.js';
import app from "./src/app.js";
const startServer = async()=>{
    try{
        await connectDB();
        console.log("database is connected");

        app.listen(env.port,()=>{
            console.log(`server is running on port ${env.port}`);
        })

    }catch(error){
        console.log(error);

    }
}
startServer();