package trombitasp.ReservationManager.repository

import org.springframework.data.jpa.repository.JpaRepository
import trombitasp.ReservationManager.model.ResourceProvider

interface ResourceProviderRepository: JpaRepository<ResourceProvider, Int>, ResourceProviderCustom {
    /*fun findAllByNameContaining(name: String): List<ResourceProvider>

    fun findAllByDescriptionContaining(description: String): List<ResourceProvider>*/
}