package trombitasp.ReservationManager.model

import com.fasterxml.jackson.annotation.JsonManagedReference
import jakarta.persistence.*
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.Size
import java.util.*

@Entity
@Table(name = "resourceProviders")
data class ResourceProvider (
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    var id: Int,

    @NotBlank
    @Size(min = 2, max = 50)
    @Column(name = "name")
    var name: String = "",

    @NotEmpty
    @Column(name = "minReservationTime")
    var minReservationTime: Date = Date(0, 0, 0, 0, 30, 0),

    @NotEmpty
    @Column(name = "maxReservationTime")
    var maxReservationTime: Date = Date(0, 0, 0, 2, 0, 0),

    @NotBlank
    @Column(name = "description")
    var description: String = "",

    @NotBlank
    @Size(max = 50)
    @Email
    @Column(name = "email")
    var email: String? = null

    /*@JsonManagedReference
    @OneToMany(mappedBy = "resourceProvider")
    var resources: List<Resource>*/
    //var imageId: Int      // TODO: később esetleg képet is menteni?
) {}