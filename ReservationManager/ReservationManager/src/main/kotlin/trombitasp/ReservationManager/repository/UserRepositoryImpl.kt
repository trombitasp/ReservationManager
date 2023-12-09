package trombitasp.ReservationManager.repository

import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import jakarta.persistence.criteria.Join
import org.springframework.stereotype.Repository
import trombitasp.ReservationManager.model.Reservation
import trombitasp.ReservationManager.model.Role
import trombitasp.ReservationManager.model.User
import java.util.*

@Repository
class UserRepositoryImpl: UserRepositoryCustom {
    @PersistenceContext
    var em: EntityManager? = null
    override fun findAll(name: String?, role: String?): List<User> {
        println("CRITERIA API USER")
        val cb = em!!.criteriaBuilder
        val cq = cb.createQuery(User::class.java)
        val user = cq.from(User::class.java)

        if (name != null) {
            if ((name.replace(" ", "")).isNotEmpty()) {
                val userPredicate = cb.like(
                    cb.lower(user.get<String>("username")),
                    "%" + name.lowercase(Locale.getDefault()) + "%"
                )
                cq.where(userPredicate)
            }
        }
        if (role != null) {
            if ((role.replace(" ", "")).isNotEmpty()) {
                val rolesJoin: Join<User, Role> = user.join("roles")
                val userPredicate = cb.equal(rolesJoin.get<String>("name"), role)
                cq.where(userPredicate)
            }
        }
        val query = em!!.createQuery<User>(cq)
        println(query.resultList)
        return query.resultList
    }
}