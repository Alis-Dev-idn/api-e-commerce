import {config} from "dotenv";
import express from "express";
import {Server} from "socket.io";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import fileUpload from "express-fileupload";
import https from "https";
import http from "http";
import fs from "fs";
import ExpressRoute from "../../routes/route.js";
config();

class ExpressServer {
    static server;
    static socket;
    static ssl = process.env.SSL;
    static key = process.env.SSL_KEY;
    static cert = process.env.SSL_CERT;

    static host = process.env.SERVER_HOST;
    static port = process.env.SERVER_PORT;

    static mongo_user = process.env.MONGO_USER;
    static mongo_pass = process.env.MONGO_PASS;
    static mongo_host = process.env.MONGO_HOST;
    static mongo_port = process.env.MONGO_PORT;
    static mongo_data = process.env.MONGO_DATA;

    static RunServer() {
        const app = express();
        app.use(morgan("dev"));
        app.use(cors());
        app.use(express.json({limit: "5MB"}));
        app.use(express.urlencoded({extended: false}));
        app.use(fileUpload({limit: {fileSize: 50 *1024*1024}}));

        app.use("/", ExpressRoute.Route());

        if(this.ssl === "true"){
            const config = {
                key: fs.readFileSync(this.key),
                cert: fs.readFileSync(this.cert)
            }
            this.server = https.createServer(config, app);
        }else{
            this.server = http.createServer(app);
        }

        /*
        * start server
        */
        this.server.listen(this.port, () => {
            console.log(`server running now in ${this.ssl === "true"? "https://" : "http://"}${this.host}:${this.port}`);
            console.log("connect to mongodb ...");
            this.RunMongoDb().then((response) => {
                console.log(response);
                console.log("created socket server ...");
                this.RunSocket(this.server).then((response) => {
                    console.log(response);
                })
            });
        })
    }

    static async RunMongoDb() {
        try{
            const url = `mongodb://${this.mongo_user}:${this.mongo_pass}@${this.mongo_host}:${this.mongo_port}/${this.mongo_data}`;
            mongoose.set('strictQuery', true);
            await mongoose.connect(url);
            return "mongodb is connected";
        }catch (error){
            return "something wrong, please cek your configuration";
        }
    }

    static async RunSocket(server) {
        let io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
                credentials: true
            },
            allowEIO3: true
        });

        io.on("connection", socket => {
            console.log("user connected by id: " + socket.id);
            socket.on("disconnect", () => console.log("user disconnected by id: " + socket.id));
            /*
            * Listen / Send Message
            * */
            this.socket = socket;

        });
        return "Socket is created, ready to listen from client";
    }
}

export default ExpressServer;