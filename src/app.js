import express from "express"
import handlebars from "express-handlebars";
// import mongoose from "mongoose";
import cookieParser from 'cookie-parser';
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from 'passport';
import cors from "cors";
import cluster from "cluster";
import { cpus } from "os";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

import config from "./config.js"
import initSocket from "./services/sockets.js";
import viewsRoutes from "./routes/viewsRoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import cartsRoutes from "./routes/cartsRoutes.js";
import sessionsRoutes from "./routes/sessionRoutes.js";
import MongoSingleton from "./services/mongo.singleton.js";
import errorsHandler from "./services/errors.handler.js";
import addLogger from "./services/logger.js";


// if (cluster.isPrimary) {
//     for (let i = 0; i < cpus().length; i++) { 
//         cluster.fork()
//     }

//     cluster.on("exit", (Worker, code, signal) =>{
//         console.log(`Se cayo la instancia ${Worker.procces.pid}`)
//         cluster.fork()
//     })

// } else {
try {
//     const fecha1 = new Date("2024-09-06T20:15:25.222+00:00")
//     const fecha2 = new Date()

//     console.log(fecha1);
//     console.log(fecha2);
    

//     const tiempo1 = fecha1.getTime();
//     const tiempo2 = fecha2.getTime();

//     console.log(tiempo1);
//     console.log(tiempo2);
    
//    const date = fecha2 - fecha1


//    const tresMinutosEnMilisegundos = 15 * 1000 * 60; // 3 minutos en milisegundos
// if (date > tresMinutosEnMilisegundos) {
//     console.log("La diferencia es mayor a 15 minutos.");
// } else {
//     console.log("La diferencia no es mayor a 15 minutos.");
// }
   
    
    const app = express()

    const httpServer = app.listen(config.PORT, async () => {
        // await mongoose.connect(config.MONGODB_URI)
        MongoSingleton.getInstance()

        const socketServer = initSocket(httpServer)
        app.set("socketServer", socketServer)

        app.use(cors({
            origin: "*"
        }))

        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))

        app.use(cookieParser(config.SECRET));

        app.use(session({
            store: MongoStore.create({
                mongoUrl: config.MONGODB_URI,
                ttl: 300
            }),
            secret: config.SECRET,
            resave: true,
            saveUninitialized: true
        }))

        app.use(passport.initialize());
        app.use(passport.session());

        app.engine('handlebars', handlebars.engine())
        app.set('views', `${config.DIRNAME}/views`)
        app.set('view engine', 'handlebars')

        app.use('/static', express.static(`${config.DIRNAME}/public`));

        app.use(addLogger)
        app.use("/", viewsRoutes)
        app.use("/api/products", productsRoutes)
        app.use("/api/users", usersRoutes)
        app.use("/api/carts", cartsRoutes)
        app.use("/api/sessions", sessionsRoutes)
        app.use(errorsHandler)

        // Generamos objeto base config Swagger y levantamos
        // endpoint para servir la documentación
        const swaggerOptions = {
            definition: {
                openapi: '3.0.1',
                info: {
                    title: 'Documentación sistema AdoptMe',
                    description: 'Esta documentación cubre toda la API habilitada para AdoptMe',
                },
            },
            apis: ['./src/docs/**/*.yaml'] // todos los archivos de configuración de rutas estarán aquí
        };

        const specs = swaggerJsdoc(swaggerOptions);
        app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

        console.log(`app iniciada en el puerto ${config.PORT} con acceso a BD, (PID ${process.pid})`)
    })
} catch (error) {
    console.log(`Error al iniciar app: ${error.message}`)
}
// }


