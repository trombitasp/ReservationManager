package trombitasp.ReservationManager.model

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "reservations")
data class Reservation (
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    var id: Int,

    @ManyToOne
    @JoinColumn(name = "user_id")
    var user: User,

    @OneToOne
    @JoinColumn(name = "resource_id", referencedColumnName = "id")
    var resource: Resource,

    @Column(name = "beginningOfReservation")
    var beginningOfReservation: Date,

    @Column(name = "endOfReservation")
    var endOfReservation: Date,

    @Column(name = "description")
    var description: String
) {}