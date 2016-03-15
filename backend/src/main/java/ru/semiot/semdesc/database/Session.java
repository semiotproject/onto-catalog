package ru.semiot.semdesc.database;

import java.io.Serializable;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author Daniil Garayzuev <garayzuev@gmail.com>
 */
@Entity
@Table(name = "session")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Session.findAll", query = "SELECT s FROM Session s"),
    @NamedQuery(name = "Session.findById", query = "SELECT s FROM Session s WHERE s.id = :id"),
    @NamedQuery(name = "Session.findBySessionHash", query = "SELECT s FROM Session s WHERE s.sessionHash = :sessionHash")})
public class Session implements Serializable {
    private static final long serialVersionUID = 1L;
    @Basic(optional = false)
    @NotNull
    @Column(name = "id")
    private int id;
    @Basic(optional = false)
    @NotNull
    @Lob
    @Size(min = 1, max = 65535)
    @Column(name = "token")
    private String token;
    @Id
    @Basic(optional = false)
    @NotNull
    @Column(name = "session_hash")
    private Long sessionHash;
    @Basic(optional = false)
    @NotNull
    @Lob
    @Size(min = 1, max = 65535)
    @Column(name = "login")
    private String login;

    public Session() {
    }

    public Session(Long sessionHash) {
        this.sessionHash = sessionHash;
    }

    public Session(Long sessionHash, int id, String token, String login) {
        this.sessionHash = sessionHash;
        this.id = id;
        this.token = token;
        this.login = login;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getSessionHash() {
        return sessionHash;
    }

    public void setSessionHash(Long sessionHash) {
        this.sessionHash = sessionHash;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (sessionHash != null ? sessionHash.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Session)) {
            return false;
        }
        Session other = (Session) object;
        if ((this.sessionHash == null && other.sessionHash != null) || (this.sessionHash != null && !this.sessionHash.equals(other.sessionHash))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "database.Session[ sessionHash=" + sessionHash + " ]";
    }
    
}
