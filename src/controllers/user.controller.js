import UserService from "../services/user_service/user.service.js";
import JoiService from "../services/joi_service/joi.service.js";
import PasswordService from "../services/password_service/password.service.js";


class UserController {

    static async userLogin(req, res) {
        try{
            const username = req.body.username;
            const email = req.body.email;
            const password = req.body.password;
            if(!username && !email) return res.status(400).json({error: "username or email is required"});
            if(!password) return res.status(400).json({error: "password required"});

            UserService.userLogin({username, email, password}).then((response) => {
                res.status(200).json(response);
            }).catch(error => {
                if(error.message) return res.status(400).json({error: error.message});
                res.status(500).json({error: "Internal Error"});
            })
        }catch (error){
            res.status(500).json({error: "Internal Error"});
        }
    }

    static async GetUser(req, res) {
        try{
            let limit = 5;
            let offset = 0;
            if(req.query.limit) limit = req.query.limit;
            if(req.query.offset) offset = req.query.offset;
            const response = await UserService.GetUser("all", {limit, offset});
            res.status(200).json(response);
        }catch (error){
            console.log(error);
            res.status(500).json({error: "Internal Error"});
        }
    }

    static async CreateUser (req, res) {
        try{
            const body = req.body;
            const {error} = JoiService.CreateUser.validate(body);
            if(error) return res.status(400).json({error: error.details[0].message});
            body.active = false;
            body.password = await PasswordService.generateHast(body.password);
            UserService.CreateUser(body).then((response) => {
                res.status(200).json({message: response.message});
            }).catch((error) => {
                if(error.message)
                   return res.status(400).json({error: error.message});
                return res.status(500).json({error: "Internal Error"});
            });

        }catch (error){
            res.status(500).json({error: "Internal Error"});
        }
    }

    static async deleteUser(req, res) {
        try{
            const query = req.query;
            if(!query.id) return res.status(400).json({error: "id required in query"});
            if(! JoiService.IdValidate(query.id)) return res.status(400).json({error: "id not valid"});
            UserService.DeleteUser(query.id).then((response) => {
                res.status(200).json({message: response.message});
            }).catch(error => {
                if(error.message)
                   return res.status(404).json({error: error.message});
                res.status(500).json({error: "Internal Error"});
            });
        }catch (error){
            res.status(500).json({error: "Internal Error"});
        }
    }
}

export default UserController;