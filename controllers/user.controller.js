import UserService from "../services/user_service/user.service.js";


class UserController {

    static async GetUser(req, res) {
        try{
            const response = await UserService.GetUser();
            res.status(200).json(response);
        }catch (error){
            console.log(error);
            res.status(500).json({error: "Internal Error"});
        }
    }
}

export default UserController;