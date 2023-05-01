package trombitasp.ReservationManager.repository

import org.springframework.data.jpa.repository.JpaRepository
import trombitasp.ReservationManager.model.User

interface UserRepository : JpaRepository<User, Int> {
    fun findAllByName(name: String): List<User>

    fun findAllByRole(role: String): List<User>

    // TODO: add API endpoints here for specialized DB queries
}