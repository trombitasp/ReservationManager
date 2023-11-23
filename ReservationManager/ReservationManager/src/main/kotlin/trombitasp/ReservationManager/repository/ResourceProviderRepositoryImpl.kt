package trombitasp.ReservationManager.repository

import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import trombitasp.ReservationManager.model.Reservation
import trombitasp.ReservationManager.model.ResourceProvider
import java.util.*

class ResourceProviderRepositoryImpl: ResourceProviderCustom {
    @PersistenceContext
    var em: EntityManager? = null
    override fun findAll(name: String?, description: String?): List<ResourceProvider> {
        println("resourceprovider FINDALL")
        val cb = em!!.criteriaBuilder
        val cq = cb.createQuery(ResourceProvider::class.java)
        val resourceProv = cq.from(ResourceProvider::class.java)

        if (name != null) {
            if ((name.replace(" ", "")).isNotEmpty()) {
                val resProvPredicate = cb.like(
                    cb.lower(resourceProv.get<String>("name")),
                    "%" + name.lowercase(Locale.getDefault()) + "%"
                )
                cq.where(resProvPredicate)
            }
        }
        if (description != null) {
            if ((description.replace(" ", "")).isNotEmpty()) {
                val resProvPredicate = cb.like(
                    cb.lower(resourceProv.get<String>("description")),
                    "%" + description.lowercase(Locale.getDefault()) + "%"
                )
                cq.where(resProvPredicate)
            }
        }
        val query = em!!.createQuery<ResourceProvider>(cq)
        return query.resultList
    }
}