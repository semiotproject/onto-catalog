package ru.semiot.database;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Random;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

/**
 *
 * @author Daniil Garayzuev <garayzuev@gmail.com>
 */
@Stateless
public class DataBase {

    @PersistenceContext(unitName = "DataSource")
    private EntityManager em;

    public long addNewUser(String token, int id, String login) {
        TypedQuery<Session> query = em.createNamedQuery("Session.findById", Session.class);
        query.setParameter("id", id);
        Session ses=null;
        try{
            Session s = query.getSingleResult();
            remove(s.getSessionHash());
            query.getSingleResult();
        }
        catch(NoResultException ex){
            ses = new Session(createHash(token, id), id, token, login);
            em.persist(ses);
        }
        return ses.getSessionHash();
    }

    private long createHash(String token, int id)  {
        MessageDigest md=null;
        try {
            md = MessageDigest.getInstance("MD5");
        } catch (NoSuchAlgorithmException ex) {
            
        }
        md.reset();
        md.update(token.getBytes());
        byte[] digest = md.digest(generateSpicy(id));
        return new BigInteger(digest).longValue();
    }

    private byte[] generateSpicy(int id) {
        int length = id % 200;
        Random rng = new Random();
        final String alphabetic = "ASDFGHJKLQWERTYUIOPZXCVBNMpoilkjuythgfmnbrewqvcdsaxz";
        char[] text = new char[length];
        for (int i = 0; i < length; i++) {
            text[i] = alphabetic.charAt(rng.nextInt(alphabetic.length()));
        }
        return new String(text).getBytes();
    }

    public String getToken(long hash) {
        Session session = em.find(Session.class, hash);
        if(session!=null)
            return session.getToken();
        return null;
    }   
    
    public String getLogin(long hash){
        Session session = em.find(Session.class, hash);
        if(session!=null)
            return session.getLogin();
        return null;
    }
    
    public void remove(long hash){
        em.remove(em.find(Session.class, hash));
    }
}
