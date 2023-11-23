package trombitasp.ReservationManager.repository

import jakarta.persistence.Id
import trombitasp.ReservationManager.model.Resource

interface ResourceRepositoryCustom {
    fun findAll(name: String?, description: String?, resourceProviderId: String?): List<Resource>
}