import express from 'express';
import {getUsers,
    getUserById,
    createUser,
    deleteUser,
    updateUser,
    getUserByUserNamePasswordEmail} from "../dataAcess/UserDA.js";
let userRouter = express.Router();
userRouter.route("/user").post(async (req, res) => {
    return res.status(201).json(await createUser(req.body));
});

userRouter.route("/users").get(async (req, res) => {
    return res.json(await getUsers());
});
userRouter.route("/user/:id").get(async (req, res) => {
    return res.json(await getUserById(req.params.id));
});
userRouter.route("/user/:id").delete(async (req, res) => {
    return res.json(await deleteUser(req.params.id));
});
userRouter.route("/user/:id").put(async (req, res) => {
    let ret = await updateUser(req.params.id, req.body);

    if (ret.error)
        res.status(400).json(ret.msg);
    else
        res.status(200).json(ret.obj)
});
userRouter.route("/user/signin").post(async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json("Missing email or password");
        }

        let user = await getUserByUserNamePasswordEmail(req.body.password, req.body.email);

        if (user) {
            return res.status(200).json(user);
        } else {
            return res.status(400).json("User not found");
        }
    } catch (error) {
        console.error("Error during sign in:", error);
        return res.status(500).json("Internal Server Error");
    }
});
export default userRouter;


