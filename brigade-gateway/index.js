const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const convict = require("convict");
const { Event } = require("./brigade-event")

const app = express();
app.use(bodyParser.raw({type: "*/*"}));

var config = convict({
    exampleVar: {
        doc: "This is an example. Feel free to delete or replace.",
        default: "EMPTY",
        env: "EXAMPLE"
    },

    port: {
        doc: "Port number",
        default: 8080,
        format: "port",
        env: "GATEWAY_PORT"
    },
    ip: {
        doc: "The pod IP address assigned by Kubernetes",
        format: "ipaddress",
        default: "127.0.0.1",
        env: "GATEWAY_IP"
    },
    namespace: {
        doc: "The Kubernetes namespace. Usually passed via downward API.",
        default: "default",
        env: "GATEWAY_NAMESPACE"
    },
    appName: {
        doc: "The name of this app, according to Kubernetes",
        default: "unknown",
        env: "GATEWAY_NAME"
    }
});
config.validate({allowed: 'strict'});
const namespace = config.get("namespace");


app.post("/v1/webhook/:hook/:project", (req, res) => {
    const eventName = req.params.hook;
    const project = req.params.project;
    const payload = req.body

    brigEvent = new Event(namespace);
    brigEvent.create(eventName, project, payload).then(() => {
        res.json({"status": "accepted"});
    }).catch((e) => {
        console.error(e);
        res.sendStatus(500);
    });
});

app.post("/v1/webhook/scale/:project/:size", (req, res) => {
    const eventName = "scale";
    const project = req.params.project;
    const size = req.params.size;

    brigEvent = new Event(namespace);
    brigEvent.create(eventName, project, size).then(() => {
        res.json({"status": "accepted"});
    }).catch((e) => {
        console.error(e);
        res.sendStatus(500);
    });
});

app.get("/healthz", (req, res)=> {
    res.send("OK");
})

// Start the server.
http.createServer(app).listen(config.get('port'), () => {
    console.log(`Running on ${config.get("ip")}:${config.get("port")}`)
})
