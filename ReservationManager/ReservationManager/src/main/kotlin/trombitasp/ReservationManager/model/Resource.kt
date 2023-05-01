package trombitasp.ReservationManager.model

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import java.util.*

@Entity
@Table(name = "resources")
data class Resource (

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    var id: Int,

    @NotBlank
    @Size(min = 2, max = 50)
    @Column(name = "name")
    var name: String,

    @Column(name = "description")
    var description: String,

    @ManyToOne
    @JoinColumn(name = "resourceProvider_id")
    var resourceProvider: ResourceProvider,

    @OneToOne(mappedBy = "resource")
    var reservation: Reservation,
    //var imageId: Int,
) {}