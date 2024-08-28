const osc = require("osc");
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8081 });

const udpPort = new osc.UDPPort({
  localAddress: "127.0.0.1",
  localPort: 57121
});

udpPort.on("message", function (oscMessage) {
  console.log("Received OSC message:", oscMessage);

  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(oscMessage));
    }
  });
});

udpPort.open();


// novuschroma42 style scene of sky ballpoint pen drawing <lora:novuschroma42 style_blue:1> <lora:sdxl_lightning_8step_lora:1>