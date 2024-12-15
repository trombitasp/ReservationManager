package trombitasp.ReservationManager.repository

import trombitasp.ReservationManager.model.Reservation

interface ReservationRepositoryCustom {
    fun findAllByUserId(id: String): List<Reservation>

    fun findAll(userId: String?, id: String?): List<Reservation>
}