package trombitasp.ReservationManager.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import trombitasp.ReservationManager.model.ERole
import trombitasp.ReservationManager.model.Role


@Repository
interface RoleRepository : JpaRepository<Role?, Long?> {
    fun findByName(name: ERole?): Role?
}