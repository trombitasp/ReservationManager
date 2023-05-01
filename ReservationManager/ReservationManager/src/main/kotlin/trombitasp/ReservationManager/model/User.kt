package trombitasp.ReservationManager.model

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank

@Entity
@Table(name = "users")
data class User (
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    var id: Int,

    @Column(name = "name")
    @NotBlank
    var name: String,

    @Column(name = "role")
    var role: String = "default",

    @OneToMany(mappedBy = "user")
    var reservations: List<Reservation> = emptyList()
) {}


// root: 1234