package trombitasp.ReservationManager.repository

import org.springframework.data.jpa.repository.JpaRepository
import trombitasp.ReservationManager.model.Resource


interface ResourceRepository: JpaRepository<Resource, Int> {
    fun findAllByNameContaining(name: String): List<Resource>

    fun findAllByDescriptionContaining(description: String): List<Resource>
    fun findAllByResourceProviderId(id: String): List<Resource>
}