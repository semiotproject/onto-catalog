package ru.semiot.ldinterface;

import java.io.ByteArrayOutputStream;
import java.io.StringWriter;
import java.io.Writer;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.xml.crypto.Data;

import org.apache.jena.atlas.web.auth.SimpleAuthenticator;
import org.apache.jena.query.DatasetAccessor;
import org.apache.jena.query.DatasetAccessorFactory;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.StmtIterator;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.LoggerFactory;
import ru.semiot.helper.RestAPI;
import static ru.semiot.helper.ServiceConfig.config;

/**
 * Linked Data Interface Web Service
 *
 * @author Daniil Garayzuev <garayzuev@gmail.com>
 * @author Nikolay Klimov
 */
@Path("/")
public class LDIApi {

    private static final org.slf4j.Logger logger = LoggerFactory
            .getLogger(LDIApi.class);

    // TODO: get this from request params
    private String constructClassURI(String uuid) {
        return String.format("http://semdesc.semiot.ru/model/%s", uuid);
    }

    private DatasetAccessor datasetAccessorFactory() {
        DatasetAccessor _accessor;
        if (config.fusekiUsername() != null && !config.fusekiUsername().isEmpty()
                && config.fusekiPassword() != null && !config.fusekiPassword().isEmpty()) {
            _accessor = DatasetAccessorFactory
                    .createHTTP(config.datasetUrl(), new SimpleAuthenticator(config.fusekiUsername(), config.fusekiPassword().toCharArray()));
        } else {
            _accessor = DatasetAccessorFactory
                    .createHTTP(config.datasetUrl());
        }
        return _accessor;
    }

    private Model getClassForURI(String classURI) {
        DatasetAccessor _accessor = datasetAccessorFactory();
        return _accessor.getModel(classURI);
    }

    private String serializeClassToFormat(Model model, String format) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        model.write(outputStream, format, null);
        return new String(outputStream.toByteArray(), StandardCharsets.UTF_8);
    }

    private Response getClass(String uuid, String format) {
        try {
            String classURI = constructClassURI(uuid);
            logger.info("finding class with URI = ", classURI);

            return Response.ok(
                    serializeClassToFormat(
                            getClassForURI(classURI), format
                    )
            ).build();
        } catch (Exception ex) {
            logger.error("failed to load class with UUID = ", uuid, "; exception: ", ex.getMessage(), "; stacktrace: ", ex.getStackTrace());
            return Response.serverError().entity(ex.getMessage()).build();
        }
    }

    @GET
    @Path("{class_uuid:.*}")
    @Produces("text/turtle")
    public Response getClassAsTurtle(@PathParam("class_uuid") String uuid) {
        return getClass(uuid, "TURTLE");
    }

    @GET
    @Path("{class_uuid:.*}")
    @Produces("application/rdf+xml")
    public Response getClassAsRDFXML(@PathParam("class_uuid") String uuid) {
        return getClass(uuid, "RDF/XML");
    }

    @GET
    @Path("{class_uuid:.*}")
    @Produces("application/ld+json")
    public Response getClassAsJSONLD(@PathParam("class_uuid") String uuid) {
        return getClass(uuid, "JSON-LD");
    }
}
