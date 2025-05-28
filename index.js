import express from "express";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";

const port = process.env.PORT || 3000;
const app = express();

let blogs = {};

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index", { blogs });
});

app.get("/edit/:id", (req, res) => {
    const blogId = req.params.id;
    const blog = blogs[blogId];
    
    if (!blog) {
        return res.send("Blog not found");
    }

    res.render("edit", { blog });
});

app.get("/write", (req, res) => {
    res.render("write");
});

app.post("/write", (req, res) => {
    const { title, content } = req.body;

    if (title && content) {
        const id = uuidv4();
        blogs[id] = { id, title, content };
        res.redirect("/");
    } else {
        console.log("Title or Content is missing");
        res.redirect("/write");
    }
});

app.post("/edit/:id", (req, res) => {
    const blogId = req.params.id;
    const { title, content } = req.body;

    if (blogs[blogId]) {
        blogs[blogId].title = title;
        blogs[blogId].content = content;
        res.redirect("/");
    } else {
        res.send("Blog not found");
    }
});

app.post("/delete/:id", (req, res) => {
    const blogId = req.params.id;
    delete blogs[blogId];
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
