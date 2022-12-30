import io from "socket.io-client";
import {config} from "dotenv";
config();

class SocketClient {
    static socket = io(`${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`).connect();

    static async sendData(topic, data) {
        return new Promise(async(resolve, reject) => {
           try{
               this.socket.emit(topic, data);
               resolve("success");
           } catch (error){
               reject(error);
           }
        });
    }
}

export default SocketClient;