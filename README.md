Before eveything start, please check eveything we need below:

- Ubuntu 20.04 LTS
- Docker
- [Metamask](https://metamask.io/)
- some Magic



# Upadte!
To run rair-node-front test, go download rairnodetest.tar


```sh
$ docker load < rairnodetest.tar
# load into docker images
$ docker images

$ docker ps -s
# it shows empty now

$ docker run -it -p 8000:80 --name rairfront rairfrounttest
# you can change rairfront everytime you boot it. It's just a name
# it's will take an well, keep terminal open, you can open other terminal types next command

$ docker ps-s
# it should be here with a new container loaded from the docker image just created
```
We then go browser to check out
- > localhost:8080


### Docker
rair-node-test is very easy to install and deploy in a Docker container.
Login with you Docker ID to push and pull images from Docker Hub.

```sh
$ sudo su
# sudo password
$ docker login
# username
# password
$ docker pull rairtechinc/docker1
```
This will create the rair-node-test image and pull in the necessary dependencies.

```sh
$ docker run -t -i rairtechinc/docker1:latest
```
This will open in /cowsay folder under our docker container
```sh
$ ls
```
Which are include with:
* demo-decrypt-node-EYSS-JuanNEW
* rair-modules-master
* protocol-spec.md
* server-config-steps+NEWUI.md
* rair-front-master
* video-encoding.md

Now, copy all top folder and md file into locally or ssh server.
you need do this with open terminal into with where you want store the file.

- > docker cp [OPTIONS] CONTAINER:SRC_PATH DEST_PATH|-

Generating pre-built foder from docker archives for distribution, for example:

```sh
$ docker cp 4c80a751205c:/cowsay/demo-decrypt-node-EYSS-JuanNEW /home/howard/rair-node-test
$ docker cp 4c80a751205c:/cowsay/rair-modules-master /home/howard/rair-node-test
$ docker cp 4c80a751205c:/cowsay/protocol-spec.md /home/howard/rair-node-test
$ docker cp 4c80a751205c:/cowsay/server-config-steps+NEWUI.md /home/howard/rair-node-test
$ docker cp 4c80a751205c:/cowsay/video-encoding.md /home/howard/rair-node-test
$ docker cp 4c80a751205c:/cowsay/rair-front-master /home/howard/rair-node-test
```

Sign permission
```sh
chmod -R 777 rair-node-test
```
### Tech
rair-node-test uses a number of open source projects to work properly:
* [node](https://nodejs.org/) - JS enhanced for our apps!
* [IPFS](https://ipfs.io/) - better than HTTP and TCP streaming
```sh
$ sudo apt update
$ sudo apt install snapd

$ sudo snap install node --classic
$ sudo snap install ipfs
```

### Installation
rair-node-test requires [Node.js](https://nodejs.org/en/) v12+ to run.

Install the dependencies and devDependencies and start the server.
```sh
$ sudo apt update
$ sudo apt install nodejs npm
```
For set up IPFS and add as startup task
```sh
$ cd rair-node-test
$ ipfs init --profile server
$ sudo nano /etc/systemd/system/ipfs.service

// paste in the following and save
[Unit]
Description=IPFS daemon
After=syslog.target network.target remote-fs.target nss-lookup.target

[Service]
Type=simple
User=rair
ExecStart=/snap/bin/ipfs daemon
Restart=on-failure

[Install]
WantedBy=multiuser.target



// then run
$ sudo systemctl start ipfs
$ sudo systemctl enable ipfs
```
For set up RAIR node service
```sh
$ sudo apt install git
$ cd demo-decrypt-node-EYSS-JuanNEW 
$ npm install
```
- > Note: systemd may had some issues with automated IPFS pins

For set up NGINX web server and Reverse Proxy
```sh
$ apt install -y nginx
$ sudo ufw allow 80
$ sudo systemctl enable nginx
$ systemctl start nginx

$ sudo nano /etc/nginx/conf.d/app.conf
// paste the following and save

server {
  listen 80 default_server;
  listen [::]:80 default_server;
  root /var/www;

  location / {
    index index.html;
    try_files $uri $uri/ /index.html;
  }

  location ~ ^/(api|stream) {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}

// restart nginx with the new config

$ sudo rm /etc/nginx/sites-enabled/default
$ sudo systemctl restart nginx
```

### Plugins
rair-node-test is currently extended with the following plugins. Instructions on how to use them in your own application are linked below.

| Plugin | Version |
| ------ | ------ |
| dependencies | ------ |
| @rair/eth-auth | 0.2.0 |
| @rair/hls-server | 0.2.1 |
| [axios](https://www.npmjs.com/package/axios) | 0.21.0 |
| [body-parser](https://www.npmjs.com/package/body-parser) | 1.19.0 |
| [dotenv](https://www.npmjs.com/package/dotenv) | 8.2.0 |
| [express](https://www.npmjs.com/package/express) | 4.17.1 |
| [express-jwt](https://www.npmjs.com/package/express-jwt)	 | 6.0.0 |
| [foreman](https://www.npmjs.com/package/foreman) | 3.0.1 |
| [ipfs-core](https://www.npmjs.com/package/ipfs-core)	 | 0.4.2 |
| [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) | 8.5.1 |
| [lowdb](https://www.npmjs.com/package/lowdb) | 1.0.0 |
| [multer](https://www.npmjs.com/package/multer) | 1.4.2 |
| [node-fetch](https://www.npmjs.com/package/node-fetch) | 2.6.1 |
| [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc) | 4.2.3 |
| [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express) | 4.1.4 |
| [web3](https://www.npmjs.com/package/web3) | 1.3.0 |
| ------ | ------ |
| devDependencies | ------ |
| [ava](https://www.npmjs.com/package/ava) | 3.13.0 |
| [eslint](https://www.npmjs.com/package/eslint) | 7.11.0 |
| [eslint-config-standard](https://www.npmjs.com/package/eslint-config-standard) | 14.1.1 |
| [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import) | 2.22.1 |
| [eslint-plugin-node](https://www.npmjs.com/package/eslint-plugin-node) | 11.1.0 |
| [eslint-plugin-promise](https://www.npmjs.com/package/eslint-plugin-promise) | 4.2.1 |
| [eslint-plugin-standard](https://www.npmjs.com/package/eslint-plugin-standard) | 4.0.1 |
| [nodemon](https://www.npmjs.com/package/nodemon) | 2.0.4 |

### Development
rair-node-test uses PM2 + Webpack for fast developing.
PM2 was used instead to maintain the service running.

Open your favorite Terminal and run these commands.
.env file (needs npm module dotenv) was also used for:

```sh
$ npm install dotenv
or 
$ yarn add dotenv
```
enviroment variables:
```sh
$ sudo npm install -g pm2
$ cd demo-decrypt-node-EYSS-JuanNEW 
$ pm2 start npm --name "rair" -- start
```
(optional) PM2 commands:
```sh
$ pm2 stop rair
$ pm2 start rair
$ pm2 restart rair
$ pm2 logs rair
```

### Building for source
For production of magic release, create and edit contents of the .env file under demo-decrypt-node-EYSS-JuanNEW folder
- > JWT_SECRET=UGt70v4#mZ0J@vHFK%b
- > INFURA_PROJECT_ID=f8232f48540f48f0a7543643e57d6278 
- > IPFS_GATEWAY=http://localhost:8080/ipfs 
- >IPFS_API=http://localhost:5001 
- >PORT=5000 
- >PINATA_KEY=aaa581a498f99ed85279 
- >PINATA_SECRET=92a0712843d62a70a2cad282bb7369b42be4ddd288543cc861a792d91d3c10a1

By Update the rair-node
> Automated process is inside the EYSS-Juan branch
```sh
$ cd demo-decrypt-node-EYSS-JuanNEW
$ npm install
$ pm2 restart rair
```

By Update the UI
```sh
//locally
$ cd rair-front-master
$ npm i
$ npm run build
```
# Todos
- Updating server with code updates
Since there is no CI/CD set up this is a manual process.
- demo-decrypt-node-EYSS-JuanNEW description
- DEMONSTRATE API
  > Usage;
  > const decryptNode = require(‘decrypt-node’);

License
----

MIT
