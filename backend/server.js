const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());


app.get("/", (req, res) => {

    res.json({
        message: "Backend application is running"
    });

});


app.get("/api/health", (req, res) => {

    res.json({

        status: "success",

        message: "Backend connected successfully",

        environment: "AWS EC2",

        timestamp: new Date()

    });

});


app.get("/api/users", (req, res) => {

    res.json([

        {
            id: 1,
            name: "Samrat",
            role: "DevOps Engineer"
        },

        {
            id: 2,
            name: "Developer",
            role: "Full Stack Developer"
        }

    ]);

});


app.listen(PORT, () => {

    console.log(
        `Backend running on port ${PORT}`
    );

});
