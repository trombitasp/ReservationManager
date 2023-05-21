package trombitasp.ReservationManager.model

import jakarta.persistence.*

data class Role (
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    var id: Int,

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    var name: ERole,
) {}