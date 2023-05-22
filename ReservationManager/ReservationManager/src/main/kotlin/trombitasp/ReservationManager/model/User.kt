package trombitasp.ReservationManager.model

import jakarta.persistence.*
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size


@Entity
@Table(name = "users")
class User: Cloneable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    var id: Int? = null

    @Column(name = "username", unique = true)
    @NotBlank
    @Size(max = 20)
    var username: String? = null

    @NotBlank
    @Size(max = 50)
    @Email
    @Column(unique = true)
    var email: String? = null

    @NotBlank
    @Size(max = 120)
    var password: String? = null

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(	name = "user_roles",
        joinColumns = [JoinColumn(name = "user_id")],
        inverseJoinColumns = [JoinColumn(name = "role_id")]
    )
    var roles: Set<Role> = HashSet()

    constructor()
    constructor(username: String?, email: String?, password: String?) {
        this.username = username
        this.email = email
        this.password = password
    }
    constructor(username: String?, email: String?, password: String?, roles: Set<Role>): this(username, email, password)  {
        this.roles = roles
    }

    public override fun clone() = User(username, email, password, roles)
}
/*
@Entity
@Table(name = "users")
data class User (
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    var id: Int,

    @Column(name = "username", unique = true)
    @NotBlank
    @Size(max = 20)
    var username: String,

    @NotBlank
    @Size(max = 50)
    @Email
    @Column(unique = true)
    var email: String,

    @NotBlank
    @Size(max = 120)
    var password: String,

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(	name = "user_roles",
        joinColumns = [JoinColumn(name = "user_id")],
        inverseJoinColumns = [JoinColumn(name = "role_id")]
    )
    var roles: Set<Role> = HashSet<Role>(),

//    @Column(name = "role")
//    var role: String = "default",
) {}
*/
// root: 1234