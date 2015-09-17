package ru.semiot.helper;

import org.aeonbits.owner.Config;
import org.aeonbits.owner.Config.LoadPolicy;
import org.aeonbits.owner.Config.LoadType;
import org.aeonbits.owner.Config.Sources;
import org.aeonbits.owner.ConfigFactory;



/**
 *
 * @author Daniil Garayzuev <garayzuev@gmail.com>
 */
@LoadPolicy(LoadType.FIRST)
@Sources({"file:/wot_semdesc_helper/backend/config.properties"})
public interface ServiceConfig extends Config{
    
    public static final ServiceConfig config = ConfigFactory
            .create(ServiceConfig.class);
    
    @DefaultValue("http://localhost:8080/fuseki/wot_semdesc_helper/data")
    @Key("fuseki.dataset.url")
    String datasetUrl();
    
    @DefaultValue("http://localhost:8080/fuseki/wot_semdesc_helper/update")
    @Key("fuseki.update.url")
    String updatetUrl();

    @DefaultValue("")
    @Key("fuseki.username")
    String fusekiUsername();

    @DefaultValue("")
    @Key("fuseki.password")
    String fusekiPassword();
    
    @DefaultValue("d7288819a9247346abe1")
    @Key("github.key")
    String githubKey();
    
    @DefaultValue("6731f159091d4f1bae8c29ad6a91277d2f99a671")
    @Key("github.secret")
    String githubSecret();
    
    @DefaultValue("http://localhost:8080/proxy-service-SNAPSHOT-1.0/login/code")
    @Key("github.callback")
    String githubUrl();
}
