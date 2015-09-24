package ru.semiot.ldinterface;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;

/**
 * REST Web Service
 *
 * @author Daniil Garayzuev <garayzuev@gmail.com>
 */
@Path("/")
public class ClassResource {

    @GET
    @Path("{uri:.*}")
    public Response getData(@PathParam("uri") String uri){
        System.out.println("Hello from data!! URI is " + uri);
        return Response.ok(uri).build();
    }
}
