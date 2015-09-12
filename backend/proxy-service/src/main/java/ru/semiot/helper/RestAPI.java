package ru.semiot.helper;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Iterator;
import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import org.apache.jena.atlas.json.JsonObject;
import org.apache.jena.query.DatasetAccessor;
import org.apache.jena.query.DatasetAccessorFactory;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.vocabulary.VCARD;
import org.scribe.builder.ServiceBuilder;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Token;
import org.scribe.model.Verb;
import org.scribe.model.Verifier;
import org.scribe.oauth.OAuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * REST Web Service
 *
 * @author Daniil Garayzuev <garayzuev@gmail.com>
 */
@Path("/")
@Stateful
public class RestAPI {

    
    private static final Logger logger = LoggerFactory
            .getLogger(RestAPI.class);
    
    private final String FUSEKI_DATASET = "http://localhost:8080/fuseki/wot_semdesc_helper/data";
    private final String API_SECRET = "6731f159091d4f1bae8c29ad6a91277d2f99a671";
    private final String API_KEY = "d7288819a9247346abe1";
    private final String API_CALLBACK = "http://www.semiot.ru";
    private String authUrl;
    @Context
    Token access;
    @Context
    UriInfo uriInfo;
    OAuthService service;
    DatasetAccessor _accessor;

    @PostConstruct
    private void _init() {
        logger.info("Initialize Web-service");
        _accessor = DatasetAccessorFactory
                .createHTTP(FUSEKI_DATASET);
        service = new ServiceBuilder()
                .provider(GitHubApi.class)
                .apiKey(API_KEY)
                .apiSecret(API_SECRET)
                .callback(API_CALLBACK).build();
        authUrl = service.getAuthorizationUrl(null);
    }

    @DELETE
    @Path("/")
    public Response removeClass(@QueryParam("class_uri") String uri) {
        logger.info("Remove method: remove uri "+uri);
        _accessor.getModel().enterCriticalSection(true);
        Resource r = _accessor.getModel().getResource(uri);
        if(r==null || r.listProperties().toList().isEmpty())
            return Response.status(Response.Status.NOT_FOUND).build();
        
        _accessor.getModel().remove(r.listProperties().toList());
        
        if(r.equals(_accessor.getModel().getResource(uri)))
            return Response.status(Response.Status.EXPECTATION_FAILED).build();
        return Response.status(Response.Status.OK).build();
    }

    @POST
    @Path("/")
    @Consumes("application/ld+json")
    public Response createClass(JsonObject object) {
        logger.info("Create method");
        logger.debug(object.toString());
        //TODO ADD new class to fuseki
        return Response.ok().build();
    }
    
    @PUT
    @Path("/")
    @Consumes("application/ld+json")
    public Response editClass(@QueryParam("class_uri") String uri, JsonObject object) {
        logger.info("Edit method: edit uri " + uri);
        Response resp = removeClass(uri);
        if(resp.getStatus()!=Response.Status.OK.getStatusCode())
            return resp;
        resp=createClass(object);
        if(resp.getStatus()!=Response.Status.OK.getStatusCode())
            return resp;
        return Response.status(Response.Status.OK).build();
    }

    @DELETE
    @Path("remove")
    public Response removeALL() {
        logger.warn("RemoveAll method");
        _accessor.deleteDefault();
        return Response.ok().build();
    }

    private void print(Model m) {
        for (Iterator iter = m.listStatements(); iter.hasNext();) {
            Statement state = (Statement) iter.next();
            System.out.println(state.asTriple().toString());
        }
    }

    @GET
    @Path("/login/redirect")
    public Response authorization() {
        try {
            return Response.temporaryRedirect(new URI(authUrl)).build();
        } catch (URISyntaxException ex) {
            return Response.serverError().entity(ex.getMessage()).build();
        }
    }

    @GET
    @Path("login/")
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(@QueryParam("code") String code) {
        logger.info("Login method");
        logger.debug("Code is " + code);
        Verifier v = new Verifier(code);
        access = service.getAccessToken(null, v);
        Response response = getUserData(access.getToken());
        logger.debug("Access token is "+ access.getToken());
        return Response.status(response.getStatus()).entity(response.getEntity()).build();
    }

    @GET
    @Path("/login/user")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserData(@QueryParam("access_token") String token) {
        logger.info("UserData method");
        logger.debug("Access token is " + token);
        String raw = "access_token=" + token + "&scope=&token_type=bearer";
        Token acc = new Token(token, "", raw);
        OAuthRequest request = new OAuthRequest(Verb.GET, "https://api.github.com/user");
        service.signRequest(acc, request);
        org.scribe.model.Response response = request.send();
        return Response.status(response.getCode()).entity(response.getBody()).build();
    }

}
