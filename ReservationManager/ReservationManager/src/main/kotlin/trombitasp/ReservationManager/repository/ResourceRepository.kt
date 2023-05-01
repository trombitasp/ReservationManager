package trombitasp.ReservationManager.repository

import org.springframework.data.jpa.repository.JpaRepository
import trombitasp.ReservationManager.model.Resource
import trombitasp.ReservationManager.model.User


interface ResourceRepository: JpaRepository<Resource, Int> {
    fun findAllByName(name: String): List<Resource>

    fun findAllByDescription(name: String): List<Resource>
}