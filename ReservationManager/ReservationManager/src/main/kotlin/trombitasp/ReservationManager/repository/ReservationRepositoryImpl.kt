package trombitasp.ReservationManager.repository

import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import org.springframework.stereotype.Repository
import trombitasp.ReservationManager.model.Reservation
import trombitasp.ReservationManager.model.User


@Repository
class ReservationRepositoryImpl: ReservationRepositoryCustom {
    @PersistenceContext
    var em: EntityManager? = null

    /*override fun findAllByUserId(id: String): List<Reservation> {
        println("CRITERIA API REPO QUERY")

        val cb = em!!.criteriaBuilder
        val cq = cb.createQuery(Reservation::class.java)
        val reservation = cq.from(Reservation::class.java)

        val reservationPredicate = cb.equal(reservation.get<Int>("user_id"), id)
        cq.where(reservationPredicate)
        val query = em!!.createQuery<Reservation>(cq)
        return query.resultList
    }*/

    override fun findAll(userId: String?, id: String?): List<Reservation> {
        println("CRITERIA API REPO QUERY __2")
        val cb = em!!.criteriaBuilder
        val cq = cb.createQuery(Reservation::class.java)
        val reservation = cq.from(Reservation::class.java)

        if (userId != null) {
            if ((userId.replace(" ", "")).isNotEmpty()) {
                println("itt")
                val reservationPredicate = cb.equal(reservation.get<User>("user").get<Int>("id"), userId)
                cq.where(reservationPredicate)
            }
        }
        if (id != null) {
            if ((id.replace(" ", "")).isNotEmpty()) {
                val reservationPredicate = cb.equal(reservation.get<Int>("id"), id)
                cq.where(reservationPredicate)
            }
        }
        val query = em!!.createQuery<Reservation>(cq)
        println(query.resultList)
        return query.resultList
    }


}