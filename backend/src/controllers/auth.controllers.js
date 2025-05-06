import bcrypt, { hash } from "bcryptjs"
import { UserRole } from "../generated/prisma/index.js"
import { db } from "../libs/db.js";
import jwt from "jsonwebtoken"


export const register = async (req, res) => {

    const { email, password, name } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All Fiels are Required"
        })
    }


    try {

        const existingUser = await db.user.findUnique({
            where: {
                email
            }
        })

        if (existingUser) {
            return res.status(400).json({
                error: "User already Exist"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: UserRole.USER

            }
        })

        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: "7D" })

        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NOE_ENV !== "development",
            maxAge: 1000 * 60 * 60 * 24 * 7
        })

        res.status(201).json({
            message: "User Created Successfully !!",
            user: {
                id: newUser.id,
                email: newUser.email,
                role: newUser.role,
                image: newUser.image
            }
        })


    } catch (error) {
        console.error("Error creating user: ", error);
        res.status(500).json({
            error: "Error Creating User"
        })
    }

}

export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await db.user.findUnique({
            where: {
                email
            }
        })

        if (!user) {
            return res.status(401).json({
                error: "user not found !! please register first !"
            })
        }


        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                error: "Invalid credentials"
            })
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)

        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_EW !== "development",
            maxAge: 1000 * 60 * 60 * 24 * 7
        })

        res.status(201).json({
            message: "User Logged in Successfully",
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                image: user.image
            }
        })




    } catch (error) {
        console.error("Error creating user: ", error);
        res.status(500).json({
            error: "Logged in failed !"
        })

    }


}

export const logout = async (req, res) => { }

export const check = async (req, res) => { }



