package ru.semiot.helper;

import org.aeonbits.owner.Config;
import org.aeonbits.owner.Config.HotReload;
import org.aeonbits.owner.Config.LoadPolicy;
import org.aeonbits.owner.Config.LoadType;
import org.aeonbits.owner.Config.Sources;
import org.aeonbits.owner.ConfigFactory;



/**
 *
 * @author Daniil Garayzuev <garayzuev@gmail.com>
 */
@HotReload
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
    
    @DefaultValue("e7d4a83b6da5fd826b79")
    @Key("github.key")
    String githubKey();
    
    @DefaultValue("d2fcb8ed9c388cb1d394b5cd1d1973c89b294065")
    @Key("github.secret")
    String githubSecret();
    
    @DefaultValue("http://semdesc.semiot.ru:8085/proxy-service-SNAPSHOT-1.0/login/code/")
    @Key("github.callback")
    String githubUrl();
}
