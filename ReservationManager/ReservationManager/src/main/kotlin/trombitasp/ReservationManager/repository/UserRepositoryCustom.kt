package trombitasp.ReservationManager.repository

import trombitasp.ReservationManager.model.User

interface UserRepositoryCustom {
    fun findAll(name: String?, role: String?): List<User>
}
