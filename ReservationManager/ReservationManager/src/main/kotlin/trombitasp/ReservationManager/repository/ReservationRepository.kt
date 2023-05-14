package trombitasp.ReservationManager.repository

import org.springframework.data.jpa.repository.JpaRepository
import trombitasp.ReservationManager.model.Reservation

interface ReservationRepository: JpaRepository<Reservation, Int> {

    fun findAllByUserId(id: String): List<Reservation>
}