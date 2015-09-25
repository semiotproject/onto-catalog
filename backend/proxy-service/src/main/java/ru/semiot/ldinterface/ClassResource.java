package ru.semiot.ldinterface;

import java.io.StringWriter;
import java.io.Writer;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import org.apache.jena.atlas.web.auth.SimpleAuthenticator;
import org.apache.jena.query.DatasetAccessor;
import org.apache.jena.query.DatasetAccessorFactory;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.StmtIterator;
import org.json.JSONException;
import org.json.JSONObject;
import static ru.semiot.helper.ServiceConfig.config;

/**
 * REST Web Service
 *
 * @author Daniil Garayzuev <garayzuev@gmail.com>
 */
@Path("/")
public class ClassResource {
    private final String path = "http://semdesc.semiot.ru/resource/";

    @GET
    @Path("{uri:.*}")
    @Produces("application/ld+json")
    public Response getData(@PathParam("uri") String uri){
        DatasetAccessor _accessor;
        if (config.fusekiUsername() != null && !config.fusekiUsername().isEmpty()
                && config.fusekiPassword() != null && !config.fusekiPassword().isEmpty()) {
            _accessor = DatasetAccessorFactory
                    .createHTTP(config.datasetUrl(), new SimpleAuthenticator(config.fusekiUsername(), config.fusekiPassword().toCharArray()));
        } else {
            _accessor = DatasetAccessorFactory
                    .createHTTP(config.datasetUrl());
        }
        Resource source = _accessor.getModel().getResource(path+uri);
        Model newModel = ModelFactory.createDefaultModel();        
        for(StmtIterator iter = source.listProperties();iter.hasNext();){
            newModel.add(iter.next());            
        }        
        Writer writer = new StringWriter();
        newModel.write(writer, "JSON-LD", null);
        JSONObject json;
        try{
            json = new JSONObject(((StringWriter)writer).toString());
            if(json.length()==0)
                return Response.status(Response.Status.NOT_FOUND).build();
        } catch (JSONException ex){
            return Response.serverError().build();
        }
        return Response.ok().entity(json.toString()).build();
    }
}
