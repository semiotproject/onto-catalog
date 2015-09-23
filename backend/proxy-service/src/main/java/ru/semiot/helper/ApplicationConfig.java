package ru.semiot.helper;

import java.util.Set;
import javax.ws.rs.core.Application;

/**
 *
 * @author Daniil Garayzuev <garayzuev@gmail.com>
 */
@javax.ws.rs.ApplicationPath("/")
public class ApplicationConfig extends Application {

    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> resources = new java.util.HashSet<>();
        addRestResourceClasses(resources);
        return resources;
    }

    /**
     * Do not modify addRestResourceClasses() method.
     * It is automatically populated with
     * all resources defined in the project.
     * If required, comment out calling this method in getClasses().
     */
    private void addRestResourceClasses(Set<Class<?>> resources) {
        resources.add(ru.semiot.helper.ClassResource.class);
        resources.add(ru.semiot.helper.RestAPI.class);
    }
    
}
