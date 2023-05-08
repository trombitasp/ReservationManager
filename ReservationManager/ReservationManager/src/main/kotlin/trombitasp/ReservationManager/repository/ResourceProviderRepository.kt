package trombitasp.ReservationManager.repository

import org.springframework.data.jpa.repository.JpaRepository
import trombitasp.ReservationManager.model.Resource
import trombitasp.ReservationManager.model.ResourceProvider

interface ResourceProviderRepository: JpaRepository<ResourceProvider, Int> {
    fun findAllByName(name: String): List<ResourceProvider>

    fun findAllByDescriptionContaining(description: String): List<ResourceProvider>
}