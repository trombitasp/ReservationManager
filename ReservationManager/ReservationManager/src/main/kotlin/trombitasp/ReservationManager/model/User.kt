package trombitasp.ReservationManager.model

import jakarta.persistence.*

@Entity
@Table(name = "users")
data class User (
    @Id
    @GeneratedValue
    var id: Int,

    var name: String,

    var role: String = "admin",

    @OneToOne(mappedBy = "currentReserver")
    var reservedResource: Resource
) {}