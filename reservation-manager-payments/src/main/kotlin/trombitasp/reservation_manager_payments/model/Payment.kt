package trombitasp.reservation_manager_payments.model

import com.fasterxml.jackson.annotation.JsonBackReference
import com.fasterxml.jackson.annotation.JsonManagedReference
import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import java.util.*

@Entity
@Table(name = "payments")
data class Payment (

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id")
    var id: Int,

    @Column(name = "havePayed")
    var havePayed: Boolean = false,

    @Column(name = "beginningOfReservation")
    var beginningOfReservation: Date,

    @Column(name = "endOfReservation")
    var endOfReservation: Date,

    @Column(name = "payedDate")
    var payedDate: Date = Date(),

) {}