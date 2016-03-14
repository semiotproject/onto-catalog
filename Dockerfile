FROM ubuntu
WORKDIR /root

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive && apt-get install -q -y wget default-jdk curl mysql-server

ENV MYSQL_CONNECTOR http://central.maven.org/maven2/mysql/mysql-connector-java/5.1.22/mysql-connector-java-5.1.22.jar
ENV WLDFL_VER 8.2.0.Final
ENV WLDFL_LINK http://download.jboss.org/wildfly/$WLDFL_VER/wildfly-$WLDFL_VER.tar.gz
ENV FUSEKI_VER apache-jena-fuseki-2.3.1
ENV FUSEKI_LINK http://apache-mirror.rbc.ru/pub/apache/jena/binaries/$FUSEKI_VER.tar.gz
ENV JAVA_HOME /usr/lib/jvm/java-7-openjdk-amd64/

# Setup Wildfly
RUN wget $WLDFL_LINK && tar xvzf wildfly-$WLDFL_VER.tar.gz && rm wildfly-$WLDFL_VER.tar.gz && mkdir -p wildfly-$WLDFL_VER/modules/system/layers/base/mysql/mysql-connector-java/main

# Config Wildfly
RUN wget -P wildfly-$WLDFL_VER/modules/system/layers/base/mysql/mysql-connector-java/main $MYSQL_CONNECTOR
ADD standalone.xml wildfly-$WLDFL_VER/standalone/configuration/
ADD module.xml wildfly-$WLDFL_VER/modules/system/layers/base/mysql/mysql-connector-java/main/

# Download Fuseki
RUN wget $FUSEKI_LINK && tar xvzf $FUSEKI_VER.tar.gz && rm $FUSEKI_VER.tar.gz && cp /root/$FUSEKI_VER/fuseki.war /root/wildfly-$WLDFL_VER/standalone/deployments/

# Config MySQL
RUN service mysql start && mysql --execute="create database semdesc; connect semdesc; create table session(id int(8), token text, session_hash bigint, login text, key(session_hash));"

# Config Fuseki
RUN mkdir /etc/fuseki/
ADD shiro.ini /etc/fuseki/
ADD config.ttl /etc/fuseki/

# Add frontend
ADD backend/target/ROOT.war /root/wildfly-$WLDFL_VER/standalone/deployments/

EXPOSE 8080

WORKDIR /root/wot-semdesc-helper/

CMD sh run.sh
