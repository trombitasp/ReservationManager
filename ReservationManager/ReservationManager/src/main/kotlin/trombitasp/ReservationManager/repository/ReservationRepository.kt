package trombitasp.ReservationManager.repository

import jakarta.persistence.EntityManager
import jakarta.persistence.criteria.CriteriaQuery
import org.springframework.data.jpa.repository.JpaRepository
import trombitasp.ReservationManager.model.Reservation


interface ReservationRepository: JpaRepository<Reservation, Int> {
    val em: EntityManager
    fun findAllByUserId(id: String): List<Reservation> {
        println("CRITERIA API REPO QUERY")

        val cb = em.criteriaBuilder
        val cq = cb.createQuery(Reservation::class.java)
        val reservation = cq.from(Reservation::class.java)

        val reservationPredicate = cb.equal(reservation.get<Int>("id"), id)
        cq.where(reservationPredicate)
        val query = em.createQuery<Reservation>(cq)
        return query.resultList
    }
}