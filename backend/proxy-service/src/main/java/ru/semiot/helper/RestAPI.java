package ru.semiot.helper;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
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
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.apache.jena.atlas.web.auth.HttpAuthenticator;
import org.apache.jena.atlas.web.auth.SimpleAuthenticator;
import org.apache.jena.query.DatasetAccessor;
import org.apache.jena.query.DatasetAccessorFactory;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.update.UpdateExecutionFactory;
import org.apache.jena.update.UpdateFactory;
import org.scribe.builder.ServiceBuilder;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Token;
import org.scribe.model.Verb;
import org.scribe.model.Verifier;
import org.scribe.oauth.OAuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import static ru.semiot.helper.ServiceConfig.config;

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

    HttpAuthenticator authenticator;    
    private String authUrl;
    OAuthService service;
    DatasetAccessor _accessor;

    @PostConstruct
    private void _init() {
        logger.info("Initialize Web-service");
        _accessor = DatasetAccessorFactory
                .createHTTP(config.datasetUrl());
        authenticator = new SimpleAuthenticator(config.fusekiUsername(), config.fusekiPassword().toCharArray());
        service = new ServiceBuilder()
                .provider(GitHubApi.class)
                .apiKey(config.githubKey())
                .apiSecret(config.githubSecret())
                .callback(config.githubUrl()).build();
        authUrl = service.getAuthorizationUrl(null);
    }

    @DELETE
    @Path("/")
    public Response removeClass(@QueryParam("class_uri") String uri) {
        logger.info("Remove method: remove uri " + uri);
        Resource r = _accessor.getModel().getResource(uri);
        if (r == null || r.listProperties().toList().isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        UpdateExecutionFactory.createRemote(UpdateFactory.create("DELETE {<" + uri + "> ?x ?z} where {<" + uri + "> ?x ?z}"), config.updatetUrl()).execute();

        Resource r2 = _accessor.getModel().getResource(uri);
        if (r2 == null || r2.listProperties().toList().isEmpty()) {
            return Response.status(Response.Status.EXPECTATION_FAILED).build();
        }
        return Response.status(Response.Status.OK).build();
    }

    @POST
    @Path("/")
    @Consumes({"application/ld+json", "application/json"})
    public Response createClass(String object) {
        logger.info("Create method");
        logger.info(object);
        Model m = ModelFactory.createDefaultModel();
        InputStream stream = new ByteArrayInputStream(object.getBytes(StandardCharsets.UTF_8));
        m.read(stream, null, "JSON-LD");
        _accessor.add(m);
        return Response.ok().build();
    }

    @PUT
    @Path("/")
    @Consumes({"application/ld+json", "application/json"})
    public Response editClass(@QueryParam("class_uri") String uri, String object) {
        logger.info("Edit method: edit uri " + uri);
        Response resp = removeClass(uri);
        if (resp.getStatus() != Response.Status.OK.getStatusCode()) {
            return resp;
        }
        resp = createClass(object);
        if (resp.getStatus() != Response.Status.OK.getStatusCode()) {
            return resp;
        }
        return Response.status(Response.Status.OK).build();
    }

    @DELETE
    @Path("remove")
    public Response removeALL() {
        logger.warn("RemoveAll method");
        _accessor.deleteDefault();
        return Response.ok().build();
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
        Token access = service.getAccessToken(null, v);
        Response response = getUserData(access.getToken());
        logger.debug("Access token is " + access.getToken());
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
