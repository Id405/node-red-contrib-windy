# node-red-contrib-windy
Node red node to upload weather data to windy.com

The node is under developement currently and while it works dont expect extensive testing.

Currently the node is set up so it collects data and will upload when it recieves a message with message.topic upload. The reccomended way to connect the node so that it uploads data is to have an inject node set to inject every 5 minutes with message.topic upload.
