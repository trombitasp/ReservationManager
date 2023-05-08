package trombitasp.ReservationManager.model

import com.fasterxml.jackson.annotation.JsonBackReference
import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "reservations")
data class Reservation (
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    var id: Int,

    //@JsonBackReference      // TODO: Nem okoz ez problémát, hogy nem kerül szerializálásra ez a property?
    @ManyToOne
    @JoinColumn(name = "user_id")
    var user: User,

    //@JsonBackReference      // TODO: Nem okoz ez problémát, hogy nem kerül szerializálásra ez a property?
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