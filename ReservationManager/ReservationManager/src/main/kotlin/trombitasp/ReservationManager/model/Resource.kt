package trombitasp.ReservationManager.model

import com.fasterxml.jackson.annotation.JsonBackReference
import com.fasterxml.jackson.annotation.JsonManagedReference
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

    //@JsonBackReference          // TODO: Nem okoz ez problémát, hogy nem kerül szerializálásra ez a property?
    @ManyToOne
    @JoinColumn(name = "resourceProvider_id")
    var resourceProvider: ResourceProvider,

    /*@JsonManagedReference
    @OneToOne(mappedBy = "resource")
    var reservation: Reservation,*/
    //var imageId: Int,
) {}