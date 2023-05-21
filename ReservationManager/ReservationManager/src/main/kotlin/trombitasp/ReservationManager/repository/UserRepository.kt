package trombitasp.ReservationManager.repository

import org.springframework.data.jpa.repository.JpaRepository
import trombitasp.ReservationManager.model.User
import java.util.*

interface UserRepository : JpaRepository<User, Int> {
    fun findAllByUsernameContaining(name: String): List<User>

    fun findByUsername(username: String?): User?
    fun findAllByRole(role: String): List<User>
    fun existsByUsername(username: String?): Boolean

    fun existsByEmail(email: String?): Boolean

    // TODO: add API endpoints here for specialized DB queries
}