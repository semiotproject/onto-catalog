FROM ubuntu
WORKDIR /wot-semdesc-helper/

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive && apt-get install -q -y wget curl mysql-server

# Install java8 (fuseki required)
RUN apt-get install -y binutils java-common unzip && \
echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | /usr/bin/debconf-set-selections && \
wget https://db.tt/dFU3BqFP -O oracle-java8-installer_8u5-1~webupd8~3_all.deb && \
dpkg -i oracle-java8-installer_8u5-1~webupd8~3_all.deb && rm oracle-java8-installer_8u5-1~webupd8~3_all.deb

ENV MYSQL_CONNECTOR http://central.maven.org/maven2/mysql/mysql-connector-java/5.1.22/mysql-connector-java-5.1.22.jar
ENV WLDFL_VER 8.2.0.Final
ENV WLDFL_LINK http://download.jboss.org/wildfly/$WLDFL_VER/wildfly-$WLDFL_VER.tar.gz
ENV FUSEKI_VER apache-jena-fuseki-2.3.1
ENV FUSEKI_LINK http://apache-mirror.rbc.ru/pub/apache/jena/binaries/$FUSEKI_VER.tar.gz
ENV JAVA_HOME /usr/lib/jvm/java-8-oracle/jre

# Setup Wildfly
RUN wget $WLDFL_LINK && tar xvzf wildfly-$WLDFL_VER.tar.gz && rm wildfly-$WLDFL_VER.tar.gz && mkdir -p wildfly-$WLDFL_VER/modules/system/layers/base/mysql/mysql-connector-java/main

# Config Wildfly
RUN wget -P wildfly-$WLDFL_VER/modules/system/layers/base/mysql/mysql-connector-java/main $MYSQL_CONNECTOR
ADD standalone.xml wildfly-$WLDFL_VER/standalone/configuration/
ADD module.xml wildfly-$WLDFL_VER/modules/system/layers/base/mysql/mysql-connector-java/main/

# Download Fuseki
RUN wget $FUSEKI_LINK && tar xvzf $FUSEKI_VER.tar.gz && rm $FUSEKI_VER.tar.gz && cp $FUSEKI_VER/fuseki.war wildfly-$WLDFL_VER/standalone/deployments/

# Config MySQL
RUN service mysql start && mysql --execute="create database semdesc; connect semdesc; create table session(id int(8), token text, session_hash bigint, login text, key(session_hash));"

# Config Fuseki
RUN mkdir /etc/fuseki/
ADD shiro.ini /etc/fuseki/
ADD config.ttl /etc/fuseki/

# Create path to db
RUN mkdir -p /etc/fuseki/databases/fuseki-db/

ADD run.sh ./
ADD updateOntology.sh ./

# Add application
ADD backend/target/ROOT.war wildfly-$WLDFL_VER/standalone/deployments/

EXPOSE 8080

VOLUME ["/etc/fuseki/databases/fuseki-db/", "/wot_semdesc_helper/backend/"]

CMD sh run.sh