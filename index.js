const express = require("express")
const jwt = require("jsonwebtoken")
let server = express();
const SECRET_JWT = "SECRETO"

var usuarios = [
    {
        id: 1,
        userName: "nbisso",
        nombre: "Nicolas",
        password: "123ASD",
        roles: [
            "ADMIN",
            "NORMAL_USER"
        ]
    },
    {
        id: 2,
        userName: "normal",
        nombre: "normal",
        password: "123ASD",
        roles: [
            "NORMAL_USER"
        ]
    }
]

server.use(express.json())



server.post("/login", (req, res) => {
    let user = req.body;
    let findUser = usuarios
        .find(r => r.userName == user.userName && r.password == user.password)

    if (!findUser) {
        res.status(400).json({
            message: "invalid user or password"
        })
    }

    let token = jwt.sign({
        id: findUser.id,
        nombre: findUser.nombre
    }, SECRET_JWT)

    res.status(200).send(token)
})


let autorizar = (rolesRequeridos) => (req, res, next) => {
    let token = req.headers["authorization"].split(" ")[1]
    console.log(token)
    let user = null;
    try {
        user = jwt.verify(token, SECRET_JWT)
    } catch (er) {
        res.status(401).send("apaaaaa a donde queres ir?")
        return;
    }

    let findUser = usuarios.find(r => r.id == user.id)
    let tieneRol = false;
    if (rolesRequeridos && rolesRequeridos.length != 0) {
        for (let i = 0; i < rolesRequeridos.length; i++) {
            const rol = rolesRequeridos[i];
            if (findUser.roles.includes(rol)) {
                tieneRol = true
            }
        }
        if (!tieneRol) {
            res.status(401).send("apaaaaa a donde queres ir?")
            return;
        }
    }


    console.log(user)

    next()
}

server.get("/abierto", (req, res) => {
    res.send("Todo ok")
})



server.get("/normal_user", autorizar(), (req, res) => {
    res.send("Hola, solo podes leer esto si estas logeado")
})

server.get("/cerrado", autorizar(["ADMIN"]), (req, res) => {
    res.send("Hola, solo podes leer esto si estas logeado")
})



server.listen(3000, () => {
    console.log("server run")
})