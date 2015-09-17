## Installation

```
sudo docker pull semiot/wot-semdesc-helper-backend
```

## Launch

```
sudo docker run -it -p 127.0.0.1:8080:8080 -v /semdesc/fuseki:/etc/fuseki -v /semdesc/config:/wot_semdesc_helper/backend/ semiot/wot-semdesc-helper-backend
```

If you want to change default configuration, you must create config.properties at /semdesc/config before you start docker.

config.properties contains:

	fuseki.dataset.url
    fuseki.update.url
	fuseki.username
    fuseki.password
    github.key
    github.secret
    github.callback
	
If any options not contained in config.properties, will be used default setting