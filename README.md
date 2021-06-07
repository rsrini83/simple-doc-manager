# doc-manager   

The quickest way to get start with Node.Js, Express & MySQL, just clone the project:

```bash
$ git clone https://github.com/rsrini83/simple-doc-manager.git
```

Install dependencies:

```bash
$ npm install
```

Start Express.js app at `http://localhost:3000/`:

```bash
$ npm start
```

# Nodemon

Nodemon will watch the files in the directory in which nodemon was started, and if any files change, nodemon will automatically restart your node application.

Start Express.js app with nodemon at `http://localhost:3000/`:

```bash
$ nodemon bin/www
```

Docker Command in Windows
#How to create the docker image 
docker build -t <image-name> .
#How to run the image
docker run -d -p 3000:3000 -e DB_HOST=host.docker.internal <image_name>


Database Script

CREATE TABLE `docs` (
	`id` BIGINT(20) NOT NULL AUTO_INCREMENT,
	`file_name` VARCHAR(50) NOT NULL COLLATE 'latin1_swedish_ci',
	`file_content` LONGBLOB NOT NULL,
	`file_type` VARCHAR(50) NOT NULL COLLATE 'latin1_swedish_ci',
	`size` VARCHAR(20) NOT NULL COLLATE 'latin1_swedish_ci',
	`uuid` VARCHAR(40) NOT NULL COLLATE 'latin1_swedish_ci',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
AUTO_INCREMENT=4