package trombitasp.ReservationManager.repository

import org.springframework.data.jpa.repository.JpaRepository
import trombitasp.ReservationManager.model.User
import java.util.*

interface UserRepository : JpaRepository<User, Int>, UserRepositoryCustom {

    fun findAllByUsernameContaining(name: String): List<User>

    fun findByUsername(username: String?): User?
    //fun findAllByRoles(role: String): List<User>
    fun existsByUsername(username: String?): Boolean

    fun existsByEmail(email: String?): Boolean

}