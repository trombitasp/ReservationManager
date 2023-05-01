package trombitasp.ReservationManager.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.CrudRepository
import trombitasp.ReservationManager.model.User

interface UserRepository : JpaRepository<User, Int> {
    // TODO: add API endpoints here for specialized db queries
}