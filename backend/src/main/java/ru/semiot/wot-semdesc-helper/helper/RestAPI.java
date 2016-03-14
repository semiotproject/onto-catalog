package ru.semiot.helper;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import javax.annotation.PostConstruct;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.CookieParam;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.NewCookie;
import javax.ws.rs.core.Response;
import org.apache.jena.atlas.web.auth.HttpAuthenticator;
import org.apache.jena.atlas.web.auth.SimpleAuthenticator;
import org.apache.jena.query.DatasetAccessor;
import org.apache.jena.query.DatasetAccessorFactory;
import org.apache.jena.rdf.model.Literal;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.StmtIterator;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.apache.jena.update.UpdateExecutionFactory;
import org.apache.jena.update.UpdateFactory;
import org.apache.jena.update.UpdateRequest;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.RDFS;
import org.json.JSONObject;
import org.scribe.builder.ServiceBuilder;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Token;
import org.scribe.model.Verb;
import org.scribe.model.Verifier;
import org.scribe.oauth.OAuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.semiot.database.DataBase;
import static ru.semiot.helper.ServiceConfig.config;

/**
 * REST Web Service
 *
 * @author Daniil Garayzuev <garayzuev@gmail.com>
 */
@Path("/")
@Stateless
public class RestAPI {

    private static final Logger logger = LoggerFactory
            .getLogger(RestAPI.class);
    @Inject
    DataBase db;
    HttpAuthenticator authenticator;
    private String authUrl;
    OAuthService service;
    DatasetAccessor _accessor;
    private final String TOKEN = "access_token=${TOKEN}&scope=&token_type=bearer";
    private final String DROP_GRAPH = "DROP GRAPH <${URI}>";

    @PostConstruct
    private void _init() {
        logger.info("Initialize Web-service");
        if (config.fusekiUsername() != null && !config.fusekiUsername().isEmpty()
                && config.fusekiPassword() != null && !config.fusekiPassword().isEmpty()) {
            authenticator = new SimpleAuthenticator(config.fusekiUsername(), config.fusekiPassword().toCharArray());
            _accessor = DatasetAccessorFactory
                    .createHTTP(config.datasetUrl(), authenticator);
        } else {
            _accessor = DatasetAccessorFactory
                    .createHTTP(config.datasetUrl());
        }
        service = new ServiceBuilder()
                .provider(GitHubApi.class)
                .apiKey(config.githubKey())
                .apiSecret(config.githubSecret())
                .callback(config.githubUrl()).build();
        authUrl = service.getAuthorizationUrl(null);
    }

    @DELETE
    @Path("model/{class_uri:.*}")
    public Response removeClass(@CookieParam("hash") long hash, @PathParam("class_uri") String uri) {
        logger.info("Remove method");
        logger.debug("URI to remove is " + uri);
        String token = db.getToken(hash);
        if (token == null || getUser(token) == null) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
        if (uri == null || uri.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        Model model = _accessor.getModel(uri);

        if (model == null || model.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        Resource owner = model.getResource(uri).getPropertyResourceValue(model.getProperty("http://www.w3.org/ns/prov#wasAttributedTo"));
        Literal account = owner.getProperty(FOAF.accountName).getObject().asLiteral();
        if (!db.getLogin(hash).equals(account.getString())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        UpdateRequest query = UpdateFactory.create(DROP_GRAPH.replace("${URI}", uri));
        if (config.fusekiUsername() != null && !config.fusekiUsername().isEmpty()
                && config.fusekiPassword() != null && !config.fusekiPassword().isEmpty()) {
            UpdateExecutionFactory.createRemote(query, config.updatetUrl(), authenticator).execute();
        } else {
            UpdateExecutionFactory.createRemote(query, config.updatetUrl()).execute();
        }

        return Response.status(Response.Status.OK).build();
    }

    @POST
    @Path("model/")
    @Consumes("text/turtle")
    public Response createClass(@CookieParam("hash") long hash, String object) {
        logger.info("Create method");
        String token = db.getToken(hash);
        JSONObject user = null;
        if (token == null || (user = getUser(token)) == null) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
        if (object == null || object.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        try {
            Model m = ModelFactory.createDefaultModel();
            InputStream stream = new ByteArrayInputStream(object.getBytes(StandardCharsets.UTF_8));
            m.read(stream, null, "TURTLE");
            logger.info("Model done");
            StmtIterator iter = m.listStatements(null, RDFS.subClassOf, m.getResource(m.getNsPrefixURI("ssn")+"System"));
            String graph_uri = iter.next().getSubject().getURI();            
            if (_accessor.containsModel(graph_uri)) {
                return Response.status(Response.Status.BAD_REQUEST).build();
            }
            UUID id = UUID.randomUUID();
            m.setNsPrefix("prov", "http://www.w3.org/ns/prov#");
            m.setNsPrefix("semdesc-user", "http://semdesc.semiot.ru/users/");
            m.setNsPrefix("foaf", FOAF.getURI());

            Resource homepage = m.createResource(user.getString("html_url"))
                    .addProperty(RDF.type, FOAF.PersonalProfileDocument);

            Resource owner = m.createResource(m.getNsPrefixURI("semdesc-user") + id.toString())
                    .addProperty(RDF.type, m.createResource(m.getNsPrefixURI("prov") + "Agent"))
                    .addProperty(RDF.type, m.createResource(m.getNsPrefixURI("prov") + "Person"))
                    .addProperty(RDF.type, m.createResource(m.getNsPrefixURI("foaf") + "Person"))
                    .addProperty(FOAF.name, user.getString("name"))
                    .addProperty(FOAF.accountName, db.getLogin(hash))
                    .addProperty(FOAF.homepage, homepage);
            if (user.has("email") && !user.isNull("email")) {
                owner.addProperty(FOAF.mbox, "<mailto:" + user.getString("email") + ">");
            }

            homepage
                    .addProperty(FOAF.maker, owner)
                    .addProperty(FOAF.primaryTopic, owner);

            m.createResource(graph_uri)
                    .addProperty(RDF.type, m.createResource(m.getNsPrefixURI("prov") + "Entity"))
                    .addProperty(m.createProperty(m.getNsPrefixURI("prov") + "wasAttributedTo"), owner);

            _accessor.add(graph_uri, m);
            return Response.ok().build();
        } catch (Exception ex) {
            logger.error("Unexpected exception with message " + ex.getMessage());
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
    }

    @PUT
    @Path("model/{class_uri:.*}")
    @Consumes("text/turtle")
    public Response editClass(@CookieParam("hash") long hash, @PathParam("class_uri") String uri, String object) {
        logger.info("Edit method");
        logger.debug("URI to edit is " + uri);
        Response resp = removeClass(hash, uri);
        if (resp.getStatus() != Response.Status.OK.getStatusCode()) {
            return resp;
        }
        resp = createClass(hash, object);
        if (resp.getStatus() != Response.Status.OK.getStatusCode()) {
            return resp;
        }
        return Response.status(Response.Status.OK).build();
    }

    @GET
    @Path("/login/")
    public Response authorization() {
        try {
            return Response.temporaryRedirect(new URI(authUrl)).build();
        } catch (URISyntaxException ex) {
            return Response.serverError().entity(ex.getMessage()).build();
        }
    }

    @GET
    @Path("/login/code/")
    public Response login(@QueryParam("code") String code) {
        logger.info("Login method");
        Verifier v = new Verifier(code);
        Token access = service.getAccessToken(null, v);
        JSONObject json = getUser(access.getToken());
        long hash = db.addNewUser(access.getToken(), json.getInt("id"), json.getString("login"));
        try {
            return Response.temporaryRedirect(new URI("http://semdesc.semiot.ru")).cookie(new NewCookie("hash", Long.toString(hash), "/", null, null, -1, false)).build();
        } catch (URISyntaxException ex) {
            return Response.serverError().entity(ex.getMessage()).build();
        }
    }

    @GET
    @Path("/login/user")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserData(@CookieParam("hash") long hash) {
        logger.info("UserData method");
        String token = db.getToken(hash);
        if (token == null) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        JSONObject json = getUser(token);
        if (json == null) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
        return Response.ok(json.toString()).build();
    }

    private JSONObject getUser(String token) {
        String raw = TOKEN.replace("${TOKEN}", token);
        Token acc = new Token(token, "", raw);
        OAuthRequest request = new OAuthRequest(Verb.GET, "https://api.github.com/user");
        service.signRequest(acc, request);
        org.scribe.model.Response response = request.send();
        if (response.getCode() != 200) {
            return null;
        }
        return new JSONObject(response.getBody());
    }

    @GET
    @Path("/logout")
    @Produces(MediaType.APPLICATION_JSON)
    public Response logout(@CookieParam("hash") long hash) throws URISyntaxException {
        logger.info("Logout method");
        String token = db.getToken(hash);
        if (token != null) {
            db.remove(hash);
            return Response.temporaryRedirect(new URI("http://semdesc.semiot.ru")).build();
        }
        return Response.temporaryRedirect(new URI("http://semdesc.semiot.ru")).build();
    }
}
