FROM ubuntu
WORKDIR /root

#
# BACKEND
#

ENV MYSQL_CONNECTOR http://central.maven.org/maven2/mysql/mysql-connector-java/5.1.22/mysql-connector-java-5.1.22.jar
ENV WLDFL http://download.jboss.org/wildfly/8.2.0.Final/wildfly-8.2.0.Final.tar.gz
ENV FUSEKI http://apache-mirror.rbc.ru/pub/apache/jena/binaries/apache-jena-fuseki-2.3.0.tar.gz
ENV JAVA_HOME /usr/lib/jvm/java-8-oracle/jre

# Java
RUN apt-get update && apt-get install -y wget binutils java-common unzip && \
echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | /usr/bin/debconf-set-selections && \
wget https://db.tt/dFU3BqFP -O /root/oracle-java8-installer_8u5-1~webupd8~3_all.deb && \
dpkg -i oracle-java8-installer_8u5-1~webupd8~3_all.deb && rm oracle-java8-installer_8u5-1~webupd8~3_all.deb

# Utils
RUN apt-get update && apt-get install -y maven git

# Setup Wildfly
RUN wget $WLDFL && tar xvzf wildfly-8.2.0.Final.tar.gz && rm wildfly-8.2.0.Final.tar.gz && mkdir -p wildfly-8.2.0.Final/modules/system/layers/base/mysql/mysql-connector-java/main

# Config Wildfly
RUN wget -P wildfly-8.2.0.Final/modules/system/layers/base/mysql/mysql-connector-java/main $MYSQL_CONNECTOR
ADD standalone.xml wildfly-8.2.0.Final/standalone/configuration/
ADD module.xml wildfly-8.2.0.Final/modules/system/layers/base/mysql/mysql-connector-java/main/

# Setup MySQL
RUN export DEBIAN_FRONTEND=noninteractive && apt-get -q -y install mysql-server

# Download Fuseki
RUN wget $FUSEKI && tar xvzf apache-jena-fuseki-2.3.0.tar.gz && rm apache-jena-fuseki-2.3.0.tar.gz

# Config MySQL
RUN service mysql start && mysql --execute="create database semdesc; connect semdesc; create table session(id int(8), token text, session_hash bigint, login text, key(session_hash));"

# Config Fuseki
RUN mkdir /etc/fuseki/
ADD shiro.ini /etc/fuseki/
ADD config.ttl /etc/fuseki/

ADD https://github.com/semiotproject/wot-semdesc-helper/archive/master.zip /root/
RUN unzip /root/master.zip && mv wot-semdesc-helper-master wot-semdesc-helper

RUN cd /root/

# Deploy to Wildfly
WORKDIR /root/wot-semdesc-helper/backend/proxy-service/
RUN mvn clean install && cp /root/apache-jena-fuseki-2.3.0/fuseki.war /root/wildfly-8.2.0.Final/standalone/deployments/ && cp /root/wot-semdesc-helper/backend/proxy-service/target/ROOT.war /root/wildfly-8.2.0.Final/standalone/deployments/

#
# FRONTEND
#

# install NGINX
RUN apt-get update && \
    apt-get install -y nginx

# add NGINX conf
ADD ./nginx.conf /etc/nginx/nginx.conf

# Add frontend
ADD frontend/dist/ /var/www/html

EXPOSE 80

CMD eval "service mysql start && /root/wildfly-8.2.0.Final/bin/standalone.sh -b 0.0.0.0 &" && service nginx start
