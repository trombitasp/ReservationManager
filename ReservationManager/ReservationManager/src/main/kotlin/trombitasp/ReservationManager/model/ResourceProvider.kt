package trombitasp.ReservationManager.model

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.Size
import java.util.*

@Entity
@Table(name = "resourceProviders")
class ResourceProvider (
    @Id
    @GeneratedValue
    var id: Int,

    @NotBlank
    @Size(min = 2, max = 50)
    var name: String = "",

    @NotEmpty
    var minReservationTime: Date = Date(0, 0, 0, 0, 30, 0),

    @NotEmpty
    var maxReservationTime: Date = Date(0, 0, 0, 2, 0, 0),

    @NotBlank
    var description: String = "",

    @OneToMany(mappedBy = "resourceProvider")
    var resources: List<Resource>
    //var imageId: Int
) {}