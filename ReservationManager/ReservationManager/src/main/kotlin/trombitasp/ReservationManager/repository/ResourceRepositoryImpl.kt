package trombitasp.ReservationManager.repository

import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import org.springframework.stereotype.Repository
import trombitasp.ReservationManager.model.Reservation
import trombitasp.ReservationManager.model.Resource
import trombitasp.ReservationManager.model.ResourceProvider
import trombitasp.ReservationManager.model.User
import java.util.*

@Repository
class ResourceRepositoryImpl: ResourceRepositoryCustom {
    @PersistenceContext
    var em: EntityManager? = null
    override fun findAll(name: String?, description: String?, resourceProviderId: String?): List<Resource> {
        println("CRITERIA RESOURCE")
        val cb = em!!.criteriaBuilder
        val cq = cb.createQuery(Resource::class.java)
        val resource = cq.from(Resource::class.java)

        if (name != null) {
            if ((name.replace(" ", "")).isNotEmpty()) {
                val resProvPredicate = cb.like(
                    cb.lower(resource.get<String>("name")),
                    "%" + name.lowercase(Locale.getDefault()) + "%"
                )
                cq.where(resProvPredicate)
            }
        }
        if (description != null) {
            if ((description.replace(" ", "")).isNotEmpty()) {
                val resProvPredicate = cb.like(
                    cb.lower(resource.get<String>("description")),
                    "%" + description.lowercase(Locale.getDefault()) + "%"
                )
                cq.where(resProvPredicate)
            }
        }
        if (resourceProviderId != null) {
            if ((resourceProviderId.replace(" ", "")).isNotEmpty()) {
                val reservationPredicate =
                    cb.equal(resource.get<ResourceProvider>("resourceProvider").get<Int>("id"), resourceProviderId)
                cq.where(reservationPredicate)
            }
        }
        val query = em!!.createQuery<Resource>(cq)
        return query.resultList
    }
}