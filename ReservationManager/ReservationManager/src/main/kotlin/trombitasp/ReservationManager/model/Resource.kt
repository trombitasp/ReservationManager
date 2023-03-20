package trombitasp.ReservationManager.model

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import java.util.*

@Entity
@Table(name = "resources")
class Resource (

    @Id
    @GeneratedValue
    var id: Int,

    @NotBlank
    @Size(min = 2, max = 50)
    var name: String,
    var description: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resourceProvider")
    var resourceProvider: ResourceProvider,
    var isReserved: Boolean = false,

    var beginningOfReservation: Date,
    var endOfReservation: Date,

    @OneToOne
    var currentReserver: User? = null
    //var imageId: Int,
) {}