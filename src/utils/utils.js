import {config} from "dotenv";
import jwt from "jsonwebtoken";
config();
import fs from "fs";

class Utils {

    static async createToken(data) {
        const privateKey = fs.readFileSync("./src/key/private.key");
        return jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (180 * 60),
            data: data
        }, privateKey, {algorithm: 'RS256', allowInsecureKeySizes: true});
    }

    static async middleware(req, res, next) {
        let key = req.headers.authorization;
        const publicKey = fs.readFileSync("./src/key/public.key");
        if(!key) return res.status(400).json({message: "token is required"});
        try{
            key = key.split(" ");
            await jwt.verify(key[1], publicKey, {algorithm: 'RS256'});
            const decode = jwt.decode(key[1]);
            req._id = decode.data.id;
            next();
        }catch (error){
            res.status(401).json({message: "token expired"});
        }
    }
}

export default Utils;