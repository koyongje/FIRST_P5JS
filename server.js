const osc = require("osc");
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8081 });

const udpPort = new osc.UDPPort({
  localAddress: "192.168.68.120",
  localPort: 7788,
  remoteAddress: "192.168.68.120",
  remotePort: 7799,
});

udpPort.open();

console.log("connecting...");
udpPort.on("message", function (oscMessage) {
console.log("Received OSC message:", oscMessage);
  if( oscMessage.address === "/hello") {
    const sendMessage = {
      address : "/ping",
      args:[
        {type:'f', value:100},
        {type:'f', value:150},
        {type:'f', value:200}
      ]
      };
      udpPort.send(sendMessage, "192.168.68.120", 7799);
      console.log("sending osc mesessage:", sendMessage);
    }
  }
  // wss.clients.forEach(function each(client) {
  //   if (client.readyState === WebSocket.OPEN) {
  //     client.send(JSON.stringify(oscMessage));
  //   }
  // });
);

udpPort.open();


// novuschroma42 style scene of sky ballpoint pen drawing <lora:novuschroma42 style_blue:1> <lora:sdxl_lightning_8step_lora:1>